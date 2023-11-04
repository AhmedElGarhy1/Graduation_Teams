import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleEnum } from 'src/common/enums/role.enum';
import { ProfilesService } from '../profiles/profiles.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { EmailService } from 'src/common/modules/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    //@InjectRepository(User) private readonly authRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: RegisterUserDto) {
    await this.usersService.checkUniqueness(data.email, data.username);
    await this.profilesService.checkUniqueness(data.phone);

    // create salt & hash
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(data.password, salt);
    const profile = await this.profilesService.create(data);

    //? assign data
    data.salt = salt;
    data.password = hash;
    data.profile = profile;
    data.roles = [RoleEnum.STUDENT];

    const user = await this.usersService.create(data);
    // await this.emailService.createEmailToken(data.email);
    // await this.emailService.sendVerificationEmail(data.email);
    const accessToken = this.generateAccessToken({ email: user.email });

    return { ...user, accessToken, message: 'Successfull Register' };
  }

  async signin(data: SigninUserDto) {
    // validate email
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException("Email doen't exist");

    // validate password
    const isValid = await user.validatePassword(data.password);
    if (!isValid) throw new BadRequestException('invalid password');
    const accessToken = this.generateAccessToken({ email: user.email });

    return { ...user, accessToken, message: 'Succussfull Login' };
  }

  async verifyEmail(emailToken: string) {
    const isExist = await this.emailService.findByEmailToken(emailToken);

    if (!isExist) {
      throw new BadRequestException('email token not valid');
    }

    const user = await this.usersService.findByEmail(isExist.email);
    if (!user) {
      throw new NotFoundException('Invalid email');
    }

    user.verifiedAt = new Date();
    const newUser = await user.save();
    await isExist.remove();
    return newUser;
  }

  generateAccessToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }

  async sendForgettenPasswordEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('email doesnt exist');

    await this.emailService.sendForgettenPasswordEmail(email);
    return user;
  }

  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('email doesnt exist');
    if (user.verifiedAt)
      throw new BadRequestException('You are already verified');

    return await this.emailService.sendVerificationEmail(email);
  }

  async resetPassword(data: ForgetPasswordDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException('Invalid email');
    }

    const passwordEntity = await this.emailService.findByPasswordToken(
      data.passwordToken,
    );

    if (!passwordEntity) {
      throw new BadRequestException('password token not valid');
    }

    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(data.newPassword, salt);

    user.salt = salt;
    user.password = hash;

    const newUser = await user.save();
    await passwordEntity.remove();
    return newUser;
  }

  // for testing
  async sentTempEmail(email: string) {
    return this.emailService.sentTempEmail(email);
  }
}
