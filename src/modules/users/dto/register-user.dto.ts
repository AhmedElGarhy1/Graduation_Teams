import { IntersectionType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { CreateProfileDto } from '../../profiles/dto/create-profile.dto';

export class RegisterUserDto extends IntersectionType(
  CreateUserDto,
  CreateProfileDto,
) {}
