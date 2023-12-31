import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/modules/users/entities/user.entity';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<RoleEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return false;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (user && user.haveRoles(requiredRoles)) return true;

    return false;
  }
}
