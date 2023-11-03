import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthConstants } from '../constants/auth-constants';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AuthConstants.strategy,
) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConstants.secretKey,
    });
  }

  async validate({ email }: IJwtPayload) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User Unauthorized');
    return user;
  }
}
