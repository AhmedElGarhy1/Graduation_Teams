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
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { ChangeTeamLeaderDto } from './dto/change-team-leader.dto';
import { UploadImageFilePipe } from 'src/common/pipes/upload-image-file.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  create(@CurrentUser() user: User, @Body() createTeamDto: CreateTeamDto) {
    // check if user enrolled in another team
    if (user.teamId) throw new BadRequestException('You already in a team');

    return this.teamsService.create(user, createTeamDto);
  }

  @Post(':id')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  addMemebr(
    @Param('id') id: number,
    @Body() addTeamMemberDto: AddTeamMemberDto,
  ) {
    return this.teamsService.addMember(id, addTeamMemberDto);
  }

  @Get()
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  @Patch(':id/change-leader')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  changeLeader(
    @Param('id') id: string,
    @Body() changeTeamLeaderDto: ChangeTeamLeaderDto,
  ) {
    return this.teamsService.changeLeader(+id, changeTeamLeaderDto);
  }

  @Patch(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  uploadImage(
    @Param('id') id: string,
    @UploadedFile(new UploadImageFilePipe()) image: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException('No Image found');

    return this.teamsService.changeImage(+id, image);
  }

  @Patch(':id/remove-image')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  removeImage(@Param('id') id: string) {
    return this.teamsService.removeImage(+id);
  }

  @Delete(':id')
  @Roles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
