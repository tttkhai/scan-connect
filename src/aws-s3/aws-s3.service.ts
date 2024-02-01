import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  uploadToS3 = async (buffer, bucket, location, fileType) => {};
}
