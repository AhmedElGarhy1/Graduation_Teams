import { Expose, Transform, Type } from 'class-transformer';

export class UsersDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => UserDto)
  data: UserDto[];
}

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  teamId: number;

  @Expose()
  @Transform(({ obj }) => obj.profile.image)
  image: string;

  @Expose()
  @Transform(({ obj }) => obj.profile.department)
  department: string;

  @Expose()
  @Transform(({ obj }) => obj.profile.level)
  level: number;
}
