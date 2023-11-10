import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  ConflictException,
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
import { Team } from '../teams/entities/team.entity';
import { User } from '../users/entities/user.entity';
import { IUserJoinTeamData } from './interfaces/user-join-team-data.interface';
import { MAX_TEAM_NUMBERS } from '../teams/constants';

@Injectable()
export class UserJoinTeamService {
  constructor(
    @InjectRepository(UserJoinTeam)
    private readonly repo: Repository<UserJoinTeam>,
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
  ) {}

  async create(user: User, createUserJoinTeamDto: CreateUserJoinTeamDto) {
    const { type, targetId } = createUserJoinTeamDto;
    let targetTeamId: number;
    let targetUserId: number;
    let targetTeam: Team;
    let targetUser: User;

    if (type === UserJoinTeamTypeEnum.TEAM) {
      targetUserId = user.id;
      targetTeamId = targetId;
      targetUser = user;
      // this will check if team Exists
      targetTeam = await this.teamsService.findOne(targetTeamId);
    } else if (type === UserJoinTeamTypeEnum.STUDENT) {
      targetUserId = targetId;
      // this will check if user Exists
      targetUser = await this.usersService.findById(targetUserId);
      // this will check if the current loged user is teamLeader
      targetTeam = await this.teamsService.findByLeaderFail(targetTeamId);
      targetTeamId = targetTeam.id;
    }
    const data: IUserJoinTeamData = {
      userId: targetUserId,
      teamId: targetTeamId,
      type,
    };

    // check is valid student
    if (targetUser.teamId)
      throw new BadRequestException('User already in team');

    // check is valid team
    if (targetTeam.members.length >= MAX_TEAM_NUMBERS)
      throw new BadRequestException('Sorry, Team is full now');

    const isVersa = await this.isVersa(data);
    if (isVersa) {
      targetUser.teamId = targetTeamId;
      targetTeam.members.push(targetUser);
      await targetTeam.save();
      return { message: 'Join request sent' };
    }

    const userJoinTeam = this.repo.create(data);
    await userJoinTeam.save();
    return { message: 'Join request sent' };
  }

  async findAllForStudents(
    userId: number,
    take: number,
    skip: number,
  ): Promise<any> {
    const [data, total] = await this.repo.findAndCount({
      take,
      skip,
      where: { userId },
    });
    return { data, total };
  }

  async findAllForLeaders(leaderId: number, take: number, skip: number) {
    const team = await this.teamsService.findByLeaderFail(leaderId);
    const [data, total] = await this.repo.findAndCount({
      take,
      skip,
      where: { teamId: team.id },
    });

    return { data, total };
  }

  // accept as team leader (from studen't to team)
  async acceptStudentRequest(leaderId: number, recordId: number) {
    const record = await this.findById(recordId);
    if (record.type !== UserJoinTeamTypeEnum.TEAM)
      throw new NotFoundException('Request not found');

    const team = await this.teamsService.findByLeaderFail(leaderId);
    if (team.id != record.teamId)
      throw new ForbiddenException("You aren't the team leader");

    if (team.members.length >= MAX_TEAM_NUMBERS) {
      await record.remove();
      throw new BadRequestException('Sorry, team is full');
    }

    const user = await this.usersService.findById(record.userId);
    if (user.teamId) {
      await record.remove();
      throw new BadRequestException('You already in team');
    }

    // now i passed
    user.teamId = team.id;
    await user.save();
    await record.remove();
    return { message: 'Successfully joined' };
  }

  // accept as student (from team to student)
  async acceptTeamRequest(userId: number, recordId: number) {
    const record = await this.findById(recordId);
    if (record.type !== UserJoinTeamTypeEnum.STUDENT)
      throw new NotFoundException('Request not found');

    let user = await this.usersService.findById(userId);
    if (user.teamId) {
      await record.remove();
      throw new ConflictException('User already in a team');
    }

    if (userId != record.userId)
      throw new ForbiddenException("You aren't the Request sender");

    const team = await this.teamsService.findOne(record.teamId);
    if (team.members.length >= MAX_TEAM_NUMBERS)
      throw new BadRequestException('Sorry, team is full');

    // now i passed
    user.teamId = team.id;
    await user.save();
    await record.remove();
    return { message: 'Successfully joined' };
  }

  // cancel as team leader (cancel)
  async cancelJoinRequest(userId: number, recordId: number) {
    const record = await this.findById(recordId);

    const team = await this.teamsService.findByLeader(userId);
    // check if he is the leader to cancel the request
    console.log(team);
    if (team) {
      if (team.id != record.teamId) {
        throw new ForbiddenException("You aren't the Team leader to accept");
      }
      await record.remove();
      return { message: 'Successfully Canceled' };
    }
    // check if he is the request sender
    if (userId != record.userId) {
      throw new ForbiddenException("You aren't the request sender");
    }
    await record.remove();
    return { message: 'Successfully Canceled' };
  }

  private async findById(id: number) {
    const record = await this.repo.findOneBy({ id });
    if (!record) throw new NotFoundException('Join Reqeust Notfound');
    return record;
  }

  private async isVersa(data: IUserJoinTeamData): Promise<boolean> {
    const { type, userId, teamId } = data;

    // check uniquness
    const sameRecord = await this.repo.findOneBy({
      userId: userId,
      teamId: teamId,
    });

    if (sameRecord) {
      if (sameRecord.type === type)
        throw new BadRequestException('You already sent sent reqeust');
      // if it reached here so the student wants and team wants
      else {
        await sameRecord.remove();
        return true;
      }
    }
    return false;
  }
}
