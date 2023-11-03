import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('forgetten-password-emails')
@Unique(['email', 'passwordToken'])
export class ForgettenPassword extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  passwordToken: string;

  @Column('timestamp')
  timestamp: Date;
}
