import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import {
  DEFAULT_IMAGE_CONTENT_TYPE,
  PRESIGNED_URL_DURATION,
} from 'src/app.constant';
import { ContentType } from 'src/qr-code/qr-code.interface';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({});
  }

  generatePresignedUrl = async (
    bucket: string,
    key: string,
    duration = PRESIGNED_URL_DURATION,
    contentType = DEFAULT_IMAGE_CONTENT_TYPE,
  ): Promise<string> => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: duration,
    });
  };

  uploadToS3 = async (
    buffer: Buffer,
    bucket: string,
    key: string,
    contentType: ContentType,
  ): Promise<void> => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: String(key),
      Body: buffer,
      ContentType: contentType,
    });
    try {
      await this.s3.send(command);
    } catch (e) {
      console.error(e);
    }
  };
}
