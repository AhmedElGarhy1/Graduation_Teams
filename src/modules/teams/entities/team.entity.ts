import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { DepartmentEnum } from 'src/common/enums/department.enum';

@Entity()
@Unique(['name'])
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DepartmentEnum,
  })
  department: DepartmentEnum;

  @Column({
    nullable: true,
  })
  image: string;

  @OneToMany(() => User, (user) => user.team, {
    eager: true,
  })
  members: User[];

  @OneToOne(() => User, (user) => user.team)
  @JoinColumn()
  leader: User;

  @Column()
  leaderId: number;
}
