import { Expose } from 'class-transformer';
import { DepartmentEnum } from 'src/enums/department.enum';
import { GenderEnum } from 'src/enums/gender.enum';

export class ProfileDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  level: number;

  @Expose()
  phone: string;

  @Expose()
  gender: GenderEnum;

  @Expose()
  department: DepartmentEnum;
}
