import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { IsEmail, IsString } from 'class-validator';
import { RoleEnum } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  salt: string;

  roles: RoleEnum[];

  profile: Profile;

  profileId: number;
}
