export interface QRQueryParam {
  [key: string]: string;
}

export interface QrMetadata {
  bucket: string;
  fileStorageLocation: string;
}

export type ContentType = 'image/png' | 'image/jpeg' | 'video/mp4';
