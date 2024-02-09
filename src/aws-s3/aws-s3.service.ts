import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  constructor(private readonly s3: S3Client);

  uploadToS3 = async (
    buffer,
    bucket,
    location,
    contentType: string,
  ): Promise<string> => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: String(key),
      Body: data,
      ContentType: contentType,
    });
    try {
      await this.s3.send(command);
      return `https://${bucket}/${key}`;
    } catch (e) {
      console.error(e);
    }
  };
}
