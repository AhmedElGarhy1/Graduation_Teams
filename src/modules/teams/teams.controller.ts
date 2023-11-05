import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ChangeTeamLeaderDto } from './dto/change-team-leader.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamDto, TeamsDto } from './dto/team.dto';
import { RoleEnum } from 'src/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UploadImageFilePipe } from 'src/pipes/upload-image-file.pipe';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Serialize(TeamDto)
  @Post()
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  create(@CurrentUser() user: User, @Body() createTeamDto: CreateTeamDto) {
    // check if user enrolled in another team
    if (user.teamId) throw new BadRequestException('You already in a team');

    return this.teamsService.create(user, createTeamDto);
  }

  @Get()
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  @Serialize(TeamsDto)
  findAll(@Query() { take, skip }) {
    return this.teamsService.findAll(take, skip);
  }

  @Serialize(TeamDto)
  @Get(':id')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Serialize(TeamDto)
  @Patch(':id')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(+id, user.id, updateTeamDto);
  }

  @Serialize(TeamDto)
  @Patch(':id/change-leader')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  changeLeader(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() changeTeamLeaderDto: ChangeTeamLeaderDto,
  ) {
    return this.teamsService.changeLeader(+id, user.id, changeTeamLeaderDto);
  }

  @Serialize(TeamDto)
  @Patch(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  uploadImage(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @UploadedFile(new UploadImageFilePipe()) image: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException('No Image found');

    return this.teamsService.changeImage(+id, user.id, image);
  }

  @Serialize(TeamDto)
  @Patch(':id/remove-image')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  removeImage(@CurrentUser() user: User, @Param('id') id: string) {
    return this.teamsService.removeImage(+id, user.id);
  }

  @Serialize(TeamDto)
  @Post(':id/members/:memberId')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  addMemebr(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Param('memberId') memberId: number,
  ) {
    return this.teamsService.addMember(id, user.id, memberId);
  }

  @Serialize(TeamDto)
  @Delete(':id/members/:memberId')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  removeMember(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Param('memberId') memberId: number,
  ) {
    return this.teamsService.removeMember(id, user.id, memberId);
  }

  @Serialize(TeamDto)
  @Delete(':id')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.teamsService.remove(+id, user.id);
  }
}
