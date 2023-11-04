import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GenderEnum } from 'src/common/enums/gender.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { DepartmentEnum } from 'src/common/enums/department.enum';

@Entity()
@Unique(['phone'])
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    array: false,
  })
  gender: GenderEnum;

  @Column({
    type: 'enum',
    enum: DepartmentEnum,
  })
  department: DepartmentEnum;

  @Column()
  age: number;

  @Column({
    nullable: true,
  })
  image: string;

  @Column()
  phone: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
