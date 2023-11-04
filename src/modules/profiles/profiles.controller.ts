import {
  Controller,
  Body,
  Get,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageFilePipe } from 'src/common/pipes/upload-image-file.pipe';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProfileDto, ProfilesDto } from './dto/profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @Serialize(ProfilesDto)
  async findAll(@Query() { take, skip }) {
    return this.profilesService.findAll(take, skip);
  }

  @Serialize(ProfileDto)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const profile = await this.profilesService.findById(+id);
    return profile;
  }

  @Serialize(ProfileDto)
  @Patch('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @CurrentUser() user: User,
    @UploadedFile(new UploadImageFilePipe()) image: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException('No Image found');

    const profile = await this.profilesService.uploadProfileImage(
      +user.profileId,
      image,
    );
    return profile;
  }

  @Patch()
  @Serialize(ProfileDto)
  async update(@CurrentUser() user: User, @Body() songData: UpdateProfileDto) {
    const profile = await this.profilesService.updateById(+user.id, songData);
    return profile;
  }

  @Serialize(ProfileDto)
  @Patch('remove-image')
  async removeImage(@CurrentUser() user: User) {
    const profile = await this.profilesService.removeProfileImage(+user.id);
    return profile;
  }
}
