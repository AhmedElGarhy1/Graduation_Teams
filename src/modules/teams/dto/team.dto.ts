import { Expose, Type, Transform } from 'class-transformer';
import { AuthDto } from 'src/modules/auth/dto/auth.dto';
import { User } from 'src/modules/users/entities/user.entity';

export class TeamsDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => TeamDto)
  data: TeamDto[];
}

export class TeamDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  department: string;

  @Expose()
  image: string;

  @Expose()
  @Transform(({ obj }) => obj.leader.username)
  leaderName: string;

  @Expose()
  @Transform(({ obj }) => obj.leader.id)
  leaderId: number;

  @Expose()
  @Type(() => AuthDto)
  @Transform(({ obj }) =>
    obj.members.map((member: User) => ({
      image: member.profile.image,
      username: member.username,
    })),
  )
  members: User[];
}
