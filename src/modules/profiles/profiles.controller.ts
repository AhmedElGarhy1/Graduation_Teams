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
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageFilePipe } from 'src/common/pipes/upload-image-file.pipe';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProfileDto } from './dto/profile.dto';

@Serialize(ProfileDto)
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  //   @Get()
  //   async getAll() {
  //     const singers = await this.profilesService.findAll();
  //     return singers;
  //   }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const profile = await this.profilesService.findById(+id);
    return profile;
  }

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
  async update(@CurrentUser() user: User, @Body() songData: UpdateProfileDto) {
    const profile = await this.profilesService.updateById(+user.id, songData);
    return profile;
  }

  @Patch('delete-image')
  async removeImage(@CurrentUser() user: User) {
    const profile = await this.profilesService.deleteProfileImage(+user.id);
    return profile;
  }
}
