import { RoleEnum } from 'src/common/enums/role.enum';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { IsEmail, IsString } from 'class-validator';
import { DepartmentEnum } from 'src/common/enums/department.enum';
import { IsEnumValidator } from 'src/common/decorators/validation/is-enum-validator.decorator';

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
