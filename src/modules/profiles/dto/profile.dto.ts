import { Expose, Transform, Type } from 'class-transformer';
import { Profile } from '../entities/profile.entity';
import { GenderEnum } from 'src/enums/gender.enum';
import { DepartmentEnum } from 'src/enums/department.enum';

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
export class ProfilesDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => ProfileDto)
  data: Profile;
}
