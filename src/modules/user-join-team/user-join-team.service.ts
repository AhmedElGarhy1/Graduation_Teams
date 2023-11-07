import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserJoinTeamDto } from './dto/create-user-join-team.dto';
import { UpdateUserJoinTeamDto } from './dto/update-user-join-team.dto';
import { Repository } from 'typeorm';
import { UserJoinTeam } from './entities/user-join-team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserJoinTeamTypeEnum } from './enums/user-join-team-types';
import { TeamsService } from '../teams/teams.service';
import { UsersService } from '../users/users.service';
import { PaginateResponse } from 'src/interfaces/paginate-response.interface';

@Injectable()
export class UserJoinTeamService {
  constructor(
    @InjectRepository(UserJoinTeam)
    private readonly repo: Repository<UserJoinTeam>,
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createUserJoinTeamDto: CreateUserJoinTeamDto) {
    const newDto = await this.joinTeamDtoFactory(userId, createUserJoinTeamDto);
    await this.checkUniqueness(newDto);
    const isVersa = await this.repo.findOneBy({
      userId: newDto.userId,
      teamId: newDto.teamId,
    });

    if (isVersa) {
      await isVersa.remove();
      const newUser = await this.usersService.findById(newDto.userId);
      const targetTeam = await this.teamsService.findOne(newDto.teamId);
      newUser.team = targetTeam;
      return 'Successfully Joined';
    }

    const userJoinTeam = this.repo.create(newDto);
    return await userJoinTeam.save();
  }

  async findAll(
    userId: number,
    take: number,
    skip: number,
  ): Promise<PaginateResponse<UserJoinTeam>> {
    const [data, total] = await this.repo.findAndCount({
      where: { userId, type: UserJoinTeamTypeEnum.USER_WANT },
      skip,
      take,
    });
    return { data, total };
  }

  remove(id: number) {
    return `This action removes a #${id} userJoinTeam`;
  }

  async joinTeamDtoFactory(userId: number, data: CreateUserJoinTeamDto) {
    let newData: CreateUserJoinTeamDto;
    const { type } = data;
    if (type === UserJoinTeamTypeEnum.USER_WANT) {
      newData = await this.joinTeam(userId, data);
    } else if (type === UserJoinTeamTypeEnum.TEAM_WANT) {
      newData = await this.joinStudent(userId, data);
    }
    return newData;
  }

  private async joinTeam(
    userId: number,
    data: CreateUserJoinTeamDto,
  ): Promise<CreateUserJoinTeamDto> {
    // check if he had a team?
    const user = await this.usersService.findById(userId);
    if (user.teamId) throw new BadRequestException('You already in a team');
    const team = await this.teamsService.findOne(data.teamId);
    if (!team) throw new BadRequestException("Team doesn't exists");
    data.userId = userId;
    return data;
  }

  private async joinStudent(
    userId: number,
    data: CreateUserJoinTeamDto,
  ): Promise<CreateUserJoinTeamDto> {
    const team = await this.teamsService.findByLeader(userId);
    // you aren't a leader
    if (!team) throw new ForbiddenException("Yourn't a leader");

    const member = await this.usersService.findById(data.userId);
    if (member.teamId)
      throw new BadRequestException(`The Student is already in a team`);

    data.teamId = team.id;
    return data;
  }

  async checkUniqueness(data: CreateUserJoinTeamDto): Promise<void> {
    //? have team
    if (await this.repo.findOneBy(data))
      throw new BadRequestException('You had already send Join Request');
  }
}
