import { Expose, Transform, Type } from 'class-transformer';
import { DepartmentEnum } from 'src/common/enums/department.enum';
import { GenderEnum } from 'src/common/enums/gender.enum';
import { Profile } from '../entities/profile.entity';

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
export class ProfilesDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => ProfileDto)
  data: Profile;
}
