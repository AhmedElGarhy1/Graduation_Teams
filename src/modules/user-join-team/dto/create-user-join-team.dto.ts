import { IsNumber, ValidateIf } from 'class-validator';
import { IsEnumValidator } from 'src/common/decorators/validation/is-enum-validator.decorator';
import { UserJoinTeamTypeEnum } from '../enums/user-join-team-types';

export class CreateUserJoinTeamDto {
  @IsEnumValidator(UserJoinTeamTypeEnum)
  type: UserJoinTeamTypeEnum;

  @IsNumber()
  targetId: number;
}
