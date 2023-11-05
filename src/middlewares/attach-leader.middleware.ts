import { Injectable, NestMiddleware } from '@nestjs/common';
import { TeamsService } from 'src/modules/teams/teams.service';

@Injectable()
export class AttachLeaderMiddleware implements NestMiddleware {
  constructor(private readonly teamsService: TeamsService) {}

  use(req: any, res: any, next: () => void) {
    const user = req.user;
    console.log(user);
    next();
  }
}
