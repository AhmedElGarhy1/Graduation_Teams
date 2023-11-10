import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Serialize(UsersDto)
  findFreeStudents(@Query() { skip, take, type }) {
    return this.usersService.findAll(skip, take, type);
  }
}
