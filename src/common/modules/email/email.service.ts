import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Repository } from 'typeorm';
import { EmailVerification } from 'src/common/modules/email/entities/email-verification.entity';
import { Nodemailer, NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { ForgettenPassword } from './entities/forgetten-password.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly verificationRepo: Repository<EmailVerification>,
    @InjectRepository(ForgettenPassword)
    private readonly forgettenPasswordRepo: Repository<ForgettenPassword>,
    private readonly nodeMailserService: Nodemailer<NodemailerDrivers.SMTP>,
  ) {}

  async findByEmailToken(emailToken: string) {
    const emailVerification = await this.verificationRepo.findOneBy({
      emailToken,
    });
    return emailVerification;
  }

  async findByPasswordToken(passwordToken: string) {
    const emailVerification = await this.forgettenPasswordRepo.findOneBy({
      passwordToken,
    });
    return emailVerification;
  }

  async createEmailToken(email: string) {
    const isExist = await this.verificationRepo.findOneBy({ email });
    // exist and less that 15 minutes
    if (isExist && this.isDateLessThat(isExist.timestamp, 15)) {
      throw new BadRequestException('email has sent recently');
    }

    const emailToken = (Math.floor(Math.random() * 99999) + 1000).toString();
    const emailVerification = this.verificationRepo.create({
      email,
      timestamp: new Date(),
      emailToken,
    });
    await emailVerification.save();
    return emailToken;
  }

  async sendVerificationEmail(email: string) {
    const isExist = await this.verificationRepo.findOneBy({ email });

    if (!isExist) {
      throw new BadRequestException('Please Register first');
    }

    const url = `http://localhost:3000/auth/email/verify/${isExist.emailToken}`;
    return this.nodeMailserService
      .sendMail({
        from: 'Company <gemater.g@gmail.com>',
        to: email,
        subject: 'Musci-Land _Verify Email_',
        html: `
        <h1>Thx for registration please verify your eamil</h1>
        <a href="${url}">Verify</a>
        `,
      })
      .then((info) => {
        console.log('Email sent successfully ' + info.messageId);
      })
      .catch((err) => {
        console.log('Faild to send email', err);
      });
  }

  async createForgettenPasswordToken(email: string) {
    const isExist = await this.forgettenPasswordRepo.findOneBy({ email });
    // exist and less that 15 minutes
    if (isExist && this.isDateLessThat(isExist.timestamp, 15)) {
      throw new BadRequestException('email has sent recently');
    }

    const passwordToken = (Math.floor(Math.random() * 99999) + 1000).toString();
    const forgettenPassword = this.forgettenPasswordRepo.create({
      email,
      timestamp: new Date(),
      passwordToken,
    });
    await forgettenPassword.save();
    return passwordToken;
  }

  async sendForgettenPasswordEmail(email: string) {
    const passwordToken = await this.createForgettenPasswordToken(email);

    return this.nodeMailserService
      .sendMail({
        from: 'Company <gemater.g@gmail.com>',
        to: email,
        subject: 'Musci-Land _Reset your Password',
        html: `
        <h1>Your Password had been reset</h1>
        <p>Your token is ${passwordToken}</p>
        `,
      })
      .then((info) => {
        console.log('Email sent successfully ' + info.messageId);
      })
      .catch((err) => {
        console.log('Faild to send email', err);
      });
  }

  // for testing
  async sentTempEmail(email: string) {
    const url = `http://localhost:3000/auth/email/verify/${email}`;
    return this.nodeMailserService
      .sendMail({
        from: 'Company <gemater.g@gmail.com>',
        to: email,
        subject: 'Musci-Land _Verify Email_',
        html: `
        <h1>Thx for registration please verify your eamil</h1>
        <a href="${url}">Verify</a>
        `,
      })
      .then((info) => {
        console.log('Email sent successfully ' + info.messageId);
      })
      .catch((err) => {
        console.log('Faild to send email', err);
      });
  }

  private async isDateLessThat(date: Date, minutes: number) {
    return (new Date().getTime() - date.getTime()) / 6000 < minutes;
  }
}
