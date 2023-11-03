import { IsString } from 'class-validator';
import { IsEnumValidator } from 'src/common/decorators/validation/is-enum-validator.decorator';
import { DepartmentEnum } from 'src/common/enums/department.enum';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsEnumValidator(DepartmentEnum)
  department: DepartmentEnum;
}
