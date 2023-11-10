import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserJoinTeamService } from './user-join-team.service';
import { CreateUserJoinTeamDto } from './dto/create-user-join-team.dto';
import { UpdateUserJoinTeamDto } from './dto/update-user-join-team.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserJoinTeamsDto } from './dto/user-join-team.dto';

@UseGuards(JwtAuthGuard)
@Controller('teams/join')
export class UserJoinTeamController {
  constructor(private readonly userJoinTeamService: UserJoinTeamService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createUserJoinTeamDto: CreateUserJoinTeamDto,
  ) {
    return this.userJoinTeamService.create(user, createUserJoinTeamDto);
  }

  @Patch('students/:id')
  acceptStudentRequest(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userJoinTeamService.acceptStudentRequest(user.id, id);
  }

  @Patch('teams/:id')
  acceptTeamRequest(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userJoinTeamService.acceptTeamRequest(user.id, id);
  }

  @Delete(':id')
  deleteRequest(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userJoinTeamService.cancelJoinRequest(user.id, id);
  }

  @Get('students')
  @Serialize(UserJoinTeamsDto)
  findAllForStudent(@CurrentUser() user: User, @Query() { take, skip }) {
    return this.userJoinTeamService.findAllForStudents(user.id, take, skip);
  }
  @Get('teams')
  @Serialize(UserJoinTeamsDto)
  findAllForLeaders(@CurrentUser() user: User, @Query() { take, skip }) {
    return this.userJoinTeamService.findAllForLeaders(user.id, take, skip);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.userJoinTeamService.remove(+id);
  }
}
