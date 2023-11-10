import { RolesBuilder } from 'nest-access-control';
import { RoleEnum } from 'src/enums/role.enum';

export const RPAC_POLICY: RolesBuilder = new RolesBuilder();

// Policies
RPAC_POLICY.grant(RoleEnum.STUDENT)
  .readOwn('profile')
  .updateOwn('profile')
  .createOwn('team')
  .grant(RoleEnum.LEADER)
  .extend(RoleEnum.STUDENT)
  .updateOwn('team')
  .deleteOwn('team')
  .grant(RoleEnum.ADMIN)
  .extend(RoleEnum.LEADER);
