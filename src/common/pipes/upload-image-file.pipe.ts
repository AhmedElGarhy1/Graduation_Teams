import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UploadImageFilePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return false;

    // check size
    // 2mb
    if (!(value.size < 2 * 1024 * 1024)) {
      throw new BadRequestException('File must be less than 2mb');
    }

    // check type
    const ext = value.originalname.split('.').pop();
    const isValidExt = ext == 'png' || ext == 'jpg' || ext == 'jpeg';
    if (!isValidExt)
      throw new BadRequestException(
        'File Must be in the following format .png|.jpg|.jpeg',
      );

    return value;
  }
}
