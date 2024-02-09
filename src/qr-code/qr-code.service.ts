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
    private readonly s3: AwsS3Service,
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
    baseUrl,
    qrMetadata: QrMetadata,
    queryParameters: QRQueryParam,
  ): Promise<string> => {
    const qrCodeBuffer = this.createQrCodeBuffer(baseUrl, queryParameters);
    this.uploadQrCodeToS3(qrCodeBuffer, qrMetadata);

    return 'fdsf';
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
      console.log('error: ', e);
    }
  };

  uploadQrCodeToS3 = async (
    qrMetadata: QRQueryParam,
    qrBuffer: Buffer,
  ): Promise<string> => {
    return await this.s3.uploadToS3(
      qrBuffer,
      qrMetadata.bucket,
      qrMetadata.fileStorageLocation,
      'image/png',
    );
  };
}
