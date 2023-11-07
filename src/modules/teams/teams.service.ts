import { PaginateResponse } from './../../interfaces/paginate-response.interface';
import { Team } from 'src/modules/teams/entities/team.entity';
import { Repository, UpdateDateColumn } from 'typeorm';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/common/modules/aws/aws.service';
import { ChangeTeamLeaderDto } from './dto/change-team-leader.dto';
import { MAX_TEAM_NUMBERS } from './constants';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AwsFolderEnum } from 'src/enums/aws-folder.enum';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly repo: Repository<Team>,
    private readonly awsService: AwsService,
    private readonly usersService: UsersService,
  ) {}

  async create(user: User, createTeamDto: CreateTeamDto): Promise<Team> {
    await this.checkUniquenessName(createTeamDto.name);
    await this.checkUniquenessLeader(user.id);
    if (user.teamId) throw new BadRequestException('You are already in team');
    const team = this.repo.create({
      ...createTeamDto,
      leaderId: user.id,
      department: user.profile.department,
    });
    team.leader = user;
    team.members = [user];
    const createdTeam = await team.save();
    user.team = createdTeam;
    await user.save();

    return createdTeam;
  }

  async findAll(take: number, skip: number): Promise<PaginateResponse<Team>> {
    const [data, total] = await this.repo.findAndCount({ take, skip });
    return { data, total };
  }

  async findByLeader(leaderId: number): Promise<Team> {
    const team = await this.repo.findOneBy({ leaderId });
    return team;
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.repo.findOneBy({ id });
    if (!team) throw new NotFoundException(`Team doesn't exist`);
    const members = await this.usersService.findByTeam(team.id);
    team.members = members;
    return team;
  }

  async update(
    id: number,
    leaderId: number,
    updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    await this.isTeamOwner(id, leaderId);
    await this.checkUniquenessName(updateTeamDto.name);
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    const newTeam = await team.save();
    return newTeam;
  }

  async remove(id: number, leaderId: number): Promise<Team> {
    await this.isTeamOwner(id, leaderId);
    const team = await this.findOne(id);
    return this.repo.remove(team);
  }

  async changeLeader(
    id: number,
    leaderId: number,
    changeTeamLeaderDto: ChangeTeamLeaderDto,
  ): Promise<Team> {
    await this.isTeamOwner(id, leaderId);
    const newLeaderId = changeTeamLeaderDto.leaderId;
    await this.checkUniquenessLeader(newLeaderId);
    const team = await this.findOne(id);
    team.leaderId = newLeaderId;
    return await team.save();
  }

  async changeImage(
    id: number,
    leaderId: number,
    image: Express.Multer.File | null,
  ): Promise<Team> {
    await this.isTeamOwner(id, leaderId);
    const team = await this.findOne(id);
    // delete the old image before uploading a new one
    if (team.image) await this.awsService.deleteFile(team.image);
    if (image) {
      team.image = await this.awsService.uploadFile(
        image,
        AwsFolderEnum.PFORILE_IMAGES,
      );
    }
    return await team.save();
  }

  async addMember(
    id: number,
    leaderId: number,
    memberId: number,
  ): Promise<Team> {
    await this.isTeamOwner(id, leaderId);
    const team = await this.findOne(id);
    if (team.members.length >= MAX_TEAM_NUMBERS)
      throw new BadRequestException(
        'The team had the maximam number of members',
      );
    const member = await this.usersService.findById(+memberId);
    // check if memeber is enrolled in another team
    if (member.teamId)
      throw new BadRequestException('Memebr is already in team');
    member.teamId = team.id;
    await member.save();
    return team;
  }

  async removeMember(
    id: number,
    leaderId: number,
    memberId: number,
  ): Promise<Team> {
    await this.isTeamOwner(id, leaderId);
    const team = await this.findOne(id);
    const member = await this.usersService.findById(memberId);
    member.teamId = null;
    await member.save();
    return team;
  }

  async checkUniquenessName(name: string): Promise<void> {
    // duplicated name
    if (await this.repo.findOneBy({ name }))
      throw new BadRequestException('there is a team with the same name');
  }

  async checkUniquenessLeader(leaderId: number): Promise<void> {
    //? have team
    if (await this.repo.findOneBy({ leaderId }))
      throw new BadRequestException('already have a team');
  }

  async isTeamOwner(teamId: number, leaderId: number): Promise<void> {
    const team = await this.repo.findOneBy({
      id: teamId,
      leaderId,
    });
    if (!team) throw new BadRequestException("You aren't the team owner");
  }
}
