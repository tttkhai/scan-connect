import * as qr from 'qrcode';
import { DEFAULT_QR_WIDTH } from 'src/app.constant';

export interface QRQueryParam {
  [key: string]: string;
}

export const makeUrl = (baseUrl: string, queryParams: QRQueryParam): string => {
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

/**
 * Return a buffer of png image
 */
export const generateQrCode = async (
  baseUrl: string,
  queryParameters: QRQueryParam,
) => {
  try {
    return await qr.toBuffer(makeUrl(baseUrl, queryParameters), {
      width: DEFAULT_QR_WIDTH,
    });
  } catch (e) {
    console.log('error: ', e);
  }
};
