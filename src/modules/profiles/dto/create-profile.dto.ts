import { IsNumber, IsPhoneNumber, IsString, Max, Min } from 'class-validator';
import { IsEnumValidator } from 'src/common/decorators/validation/is-enum-validator.decorator';
import { DepartmentEnum } from 'src/common/enums/department.enum';
import { GenderEnum } from 'src/common/enums/gender.enum';

export class CreateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  @Min(14)
  age: number;

  @IsPhoneNumber('EG')
  phone: string;

  @IsEnumValidator(GenderEnum)
  gender: GenderEnum;

  @IsEnumValidator(DepartmentEnum)
  department: DepartmentEnum;
}
