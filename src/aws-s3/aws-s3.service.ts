import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ContentType } from 'src/qr-code/qr-code.interface';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({});
  }

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
