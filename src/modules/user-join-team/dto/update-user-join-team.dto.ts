import { PartialType } from '@nestjs/mapped-types';
import { CreateUserJoinTeamDto } from './create-user-join-team.dto';

export class UpdateUserJoinTeamDto extends PartialType(CreateUserJoinTeamDto) {}
