import { IsEmail, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  newPassword: string;

  @IsString()
  passwordToken: string;
}
