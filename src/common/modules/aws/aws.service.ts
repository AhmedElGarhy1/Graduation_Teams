import { Injectable } from '@nestjs/common';

import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { AwsFolderEnum } from 'src/common/enums/aws-folder.enum';
import config from 'src/config';

const splitter = 'amazonaws.com/';

AWS.config.update({
  accessKeyId: config.aws.ACCESS_KEY_ID,
  secretAccessKey: config.aws.SECRET_ACCESS_KEY_ID,
  region: config.aws.REGION,
});

const s3 = new AWS.S3();

@Injectable()
export class AwsService {
  async uploadFile(
    file: Express.Multer.File,
    folder: AwsFolderEnum,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const original = file.originalname;
        const name = original.split('.')[0];
        const ext = extname(original);
        const random = Date.now() + '' + Math.floor(Math.random() * 999);

        const params: AWS.S3.Types.PutObjectRequest = {
          Bucket: config.aws.AWS_S3_BUCKET_NAME,
          Key: `${folder}/${name}-${random}${ext}`,
          Body: file.buffer,
          ACL: 'public-read',
        };

        s3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(`${config.aws.CDN_URL}/${data.Key}`);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  async deleteFile(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const key = filename.substring(
          filename.indexOf(splitter) + splitter.length,
        );
        const params: AWS.S3.Types.DeleteObjectRequest = {
          Bucket: config.aws.AWS_S3_BUCKET_NAME,
          Key: key,
        };

        s3.deleteObject(params, (err) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          return resolve('');
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
