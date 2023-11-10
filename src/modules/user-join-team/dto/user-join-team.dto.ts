import { Expose, Transform, Type } from 'class-transformer';
import { UserJoinTeamTypeEnum } from '../enums/user-join-team-types';

// export const genericClass = (generic: Function) => {
//   return class Generic {
//     @Expose()
//     total: number;

//     @Expose()
//     @Type(() => generic)
//     data: (typeof generic)[];
//   };
// };

export class UserJoinTeamsDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => UserJoinTeamDto)
  data: UserJoinTeamDto[];
}

export class UserJoinTeamDto {
  @Expose()
  id: number;

  @Expose()
  type: UserJoinTeamTypeEnum;

  @Expose()
  userId: number;

  @Expose()
  teamId: number;

  @Expose()
  @Transform(({ obj }) => obj.team.name)
  teamName: string;

  @Expose()
  @Transform(({ obj }) => obj.team.image)
  teamImage: string;
}
