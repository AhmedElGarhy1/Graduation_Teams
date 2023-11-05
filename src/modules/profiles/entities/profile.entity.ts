import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { DepartmentEnum } from 'src/enums/department.enum';
import { GenderEnum } from 'src/enums/gender.enum';

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
  level: number;

  @Column({
    nullable: true,
  })
  image: string;

  @Column()
  phone: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
