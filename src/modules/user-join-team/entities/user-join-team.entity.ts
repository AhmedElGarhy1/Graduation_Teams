import { Team } from 'src/modules/teams/entities/team.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserJoinTeamTypeEnum } from '../enums/user-join-team-types';

@Entity('user_join_team')
export class UserJoinTeam extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserJoinTeamTypeEnum,
  })
  type: UserJoinTeamTypeEnum;

  @ManyToOne(() => User, (user) => user.userJoinTeam)
  user: User;

  @ManyToOne(() => Team, (team) => team.userJoinTeam)
  team: Team;

  @CreateDateColumn()
  createdAt: Date;

  //   forign keys
  @Column()
  userId: number;
  @Column()
  teamId: number;
}
