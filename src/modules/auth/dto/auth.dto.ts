import { Expose, Transform } from 'class-transformer';

export class AuthDto {
  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  accessToken: string;

  @Expose()
  roles: string[];

  @Expose()
  teamId: number;

  @Expose()
  profileId: number;

  @Expose()
  @Transform(({ obj }) => obj.profile.image)
  image: string;
}
