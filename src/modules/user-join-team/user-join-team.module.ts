import { Module } from '@nestjs/common';
import { UserJoinTeamService } from './user-join-team.service';
import { UserJoinTeamController } from './user-join-team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserJoinTeam } from './entities/user-join-team.entity';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserJoinTeam]), TeamsModule, UsersModule],
  controllers: [UserJoinTeamController],
  providers: [UserJoinTeamService],
})
export class UserJoinTeamModule {}
