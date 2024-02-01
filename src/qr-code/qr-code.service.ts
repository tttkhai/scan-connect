import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qr from 'qrcode';
import { DEFAULT_QR_WIDTH } from 'src/app.constant';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

interface QRQueryParam {
  [key: string]: string;
}

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
  generateQrCode = async () => {
    const qrCodeBuffer = createQrCodeBuffer();
    this.uploadQrCodeToS3(qrCodeBuffer);
  };

  /**
   * Return a buffer of png image
   */
  createQrCodeBuffer = async (
    baseUrl: string,
    queryParameters: QRQueryParam,
  ) => {
    try {
      return await qr.toBuffer(this.makeUrl(baseUrl, queryParameters), {
        width: DEFAULT_QR_WIDTH,
      });
    } catch (e) {
      console.log('error: ', e);
    }
  };

  uploadQrCodeToS3 = async (qrMetadata: QRMetadata): Promise<void> => {
    const params = {};

    const buffer = await this.createQrCodeBuffer(
      this.configService.get<string>('SHORT_URL'),
      params,
    );

    await this.s3.uploadToS3(
      buffer,
      this.configService.get<string>('RAW_BUCKET_NAME'),
      qrMetadata.fileStorageLocation,
      'image/png',
    );
  };
}
