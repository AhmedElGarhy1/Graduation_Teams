import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserJoinTeamService } from './user-join-team.service';
import { CreateUserJoinTeamDto } from './dto/create-user-join-team.dto';
import { UpdateUserJoinTeamDto } from './dto/update-user-join-team.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('teams/join')
export class UserJoinTeamController {
  constructor(private readonly userJoinTeamService: UserJoinTeamService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createUserJoinTeamDto: CreateUserJoinTeamDto,
  ) {
    // return this.userJoinTeamService.create(user.id, createUserJoinTeamDto);
  }

  @Get()
  findAll() {
    return this.userJoinTeamService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userJoinTeamService.remove(+id);
  }
}
