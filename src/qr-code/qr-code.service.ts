import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qr from 'qrcode';
import { DEFAULT_QR_WIDTH } from 'src/app.constant';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { QRQueryParam, QrMetadata } from './qr-code.interface';

@Injectable()
export class QrCodeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  makeUrl = (baseUrl: string, queryParams: QRQueryParam): string => {
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');

    if (queryString) {
      return `${baseUrl}?${queryString}`;
    }

    return baseUrl;
  };

  generateQrCode = async (
    baseUrl: string,
    qrMetadata: QrMetadata,
    queryParameters: QRQueryParam,
  ): Promise<string> => {
    const qrCodeBuffer = await this.createQrCodeBuffer(
      baseUrl,
      queryParameters,
    );

    await this.awsS3Service.uploadToS3(
      qrCodeBuffer,
      qrMetadata.bucket,
      qrMetadata.fileStorageLocation,
      'image/png',
    );

    return `https://${qrMetadata.bucket}/${qrMetadata.fileStorageLocation}`;
  };

  /**
   * Return a buffer of png image
   */
  createQrCodeBuffer = async (
    baseUrl: string,
    queryParameters: QRQueryParam,
  ): Promise<Buffer> => {
    try {
      return await qr.toBuffer(this.makeUrl(baseUrl, queryParameters), {
        width: DEFAULT_QR_WIDTH,
      });
    } catch (e) {
      console.error('error: ', e);
    }
  };
}
