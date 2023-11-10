import { UserJoinTeamTypeEnum } from '../enums/user-join-team-types';

export interface IUserJoinTeamData {
  userId: number;
  teamId: number;
  type: UserJoinTeamTypeEnum;
}
