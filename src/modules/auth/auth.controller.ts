import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Serialize(AuthDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrent(@CurrentUser() user: User) {
    const accessToken = this.authService.generateAccessToken({
      email: user.email,
    });
    return { ...user, accessToken };
  }

  @Post('register')
  signup(@Body() data: RegisterUserDto) {
    const user = this.authService.signup(data);
    return user;
  }

  @Post('login')
  signin(@Body() data: SigninUserDto) {
    const user = this.authService.signin(data);
    return user;
  }

  @Get('email/resend-verification-email/:email')
  async resnedEmailVerification(@Param('email') email: string) {
    return this.authService.sendVerificationEmail(email);
  }

  @Get('email/verify/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('email/forget-password/:email')
  async forgetPassword(@Param('email') email: string) {
    return this.authService.sendForgettenPasswordEmail(email);
  }

  @Post('email/reset-password')
  async resetPassword(@Body() data: ForgetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Get('email/test/:email')
  async testEmailService(@Param('email') email: string) {
    return this.authService.sentTempEmail(email);
  }
}
