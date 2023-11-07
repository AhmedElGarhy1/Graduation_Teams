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
import { UserJoinTeam } from 'src/modules/user-join-team/entities/user-join-team.entity';
import { DepartmentEnum } from 'src/enums/department.enum';

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

  @OneToOne(() => User, (user) => user.team, {
    eager: true,
  })
  @JoinColumn()
  leader: User;

  @OneToMany(() => UserJoinTeam, (userJoinTeam) => userJoinTeam.team, {
    cascade: true,
  })
  userJoinTeam: UserJoinTeam[];

  @Column()
  leaderId: number;
}
