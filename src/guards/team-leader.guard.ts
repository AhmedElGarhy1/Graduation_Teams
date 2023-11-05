import { TeamsService } from './../modules/teams/teams.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TeamLeaderGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly teamsService: TeamsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    // const isLeader = await this.teamsService.findOne(userId);
    // console.log(isLeader);
    return true;
  }
}
