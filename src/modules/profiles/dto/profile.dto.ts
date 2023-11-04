import { Expose, Transform } from 'class-transformer';
import { DepartmentEnum } from 'src/common/enums/department.enum';
import { GenderEnum } from 'src/common/enums/gender.enum';

export class ProfileDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  age: number;

  @Expose()
  phone: string;

  @Expose()
  gender: GenderEnum;

  @Expose()
  department: DepartmentEnum;
}
