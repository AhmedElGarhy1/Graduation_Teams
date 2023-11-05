import { IsNumber, IsPhoneNumber, IsString, Max, Min } from 'class-validator';
import { IsEnumValidator } from 'src/common/decorators/validation/is-enum-validator.decorator';
import { DepartmentEnum } from 'src/enums/department.enum';
import { GenderEnum } from 'src/enums/gender.enum';

export class CreateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  level: number;

  @IsPhoneNumber('EG')
  phone: string;

  @IsEnumValidator(GenderEnum)
  gender: GenderEnum;

  @IsEnumValidator(DepartmentEnum)
  department: DepartmentEnum;
}
