import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { ForgettenPassword } from './entities/forgetten-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerification, ForgettenPassword])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
