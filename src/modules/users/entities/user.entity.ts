import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../../../common/enums/role.enum';
import { Profile } from '../../profiles/entities/profile.entity';
import { Team } from 'src/modules/teams/entities/team.entity';

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

  @ManyToOne(() => Team, (team) => team.members)
  team: Team;

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
}
