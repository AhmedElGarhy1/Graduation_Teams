import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserJoinTeamDto } from './dto/create-user-join-team.dto';
import { UpdateUserJoinTeamDto } from './dto/update-user-join-team.dto';
import { Repository } from 'typeorm';
import { UserJoinTeam } from './entities/user-join-team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserJoinTeamTypeEnum } from './enums/user-join-team-types';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class UserJoinTeamService {
  constructor(
    @InjectRepository(UserJoinTeam)
    private readonly repo: Repository<UserJoinTeam>,
    private readonly teamsService: TeamsService,
  ) {}

  // async create(userId: number, createUserJoinTeamDto: CreateUserJoinTeamDto) {
  //   const { type } = createUserJoinTeamDto;
  //   if (type === UserJoinTeamTypeEnum.TEAM_REQUEST) {
  //     createUserJoinTeamDto.userId = userId;
  //   } else if (type === UserJoinTeamTypeEnum.USER_REQUEST) {
  //     // here a user requested to join team
  //     const team = await this.teamsService.findByLeader(userId);
  //     // you aren't a leader
  //     if (!team) throw new ForbiddenException("Yourn't a leader");
  //     createUserJoinTeamDto.teamId = team.id;
  //   }

  //   console.log(createUserJoinTeamDto);

  //   const userJoinTeam = this.repo.create(createUserJoinTeamDto);
  //   return await this.repo.save(userJoinTeam);
  // }

  // private async joinTeam(newStudentId: number, teamId: number): CreateUserJoinTeamDto {
  //   // check if he had a team?
  //   const team = await this.teamsService.findByLeader(teamId);
  //   // you aren't a leader
  //   if (!team) throw new ForbiddenException("Yourn't a leader");
  // }

  // private async joinStudent(currentUserId: number, teamId: number) {
  //   // check if he had a team?
  //   const team = await this.teamsService.findByLeader(teamId);
  //   // you aren't a leader
  //   if (!team) throw new ForbiddenException("Yourn't a leader");
  // }

  findAll() {
    return `This action returns all userJoinTeam`;
  }

  remove(id: number) {
    return `This action removes a #${id} userJoinTeam`;
  }
}
