import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from '../../profiles/entities/profile.entity';
import { Team } from 'src/modules/teams/entities/team.entity';
import { UserJoinTeam } from 'src/modules/user-join-team/entities/user-join-team.entity';
import { RoleEnum } from 'src/enums/role.enum';

@Entity('users')
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  salt: string;

  @Column()
  username: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    array: true,
  })
  roles: RoleEnum[];

  @Column({ type: 'date', nullable: true })
  verifiedAt: Date;

  // relations
  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => Team, (team) => team.members, {
    onDelete: 'SET NULL',
  })
  team: Team;

  @OneToMany(() => UserJoinTeam, (userJoinTeam) => userJoinTeam.user, {
    cascade: true,
  })
  userJoinTeam: UserJoinTeam[];

  // forign keys
  @Column()
  profileId: number;

  @Column({ nullable: true })
  teamId: number;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  haveRoles(roles: RoleEnum[]) {
    return this.roles.some((userRole: string) => {
      return roles.some((role) => userRole === role);
    });
  }

  // for type
  isLeader: boolean;
}
