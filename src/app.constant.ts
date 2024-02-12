export const DEFAULT_QR_WIDTH = 450;

export const getBucketName = (): string => {
  return process.env.MEDIA_UPLOAD_BUCKET;
};

export const getQrFolder = (): string => {
  return process.env.MEDIA_QR_FOLDER;
};

export const PRESIGNED_URL_DURATION = 3600;

export const DEFAULT_IMAGE_CONTENT_TYPE = 'image/png';