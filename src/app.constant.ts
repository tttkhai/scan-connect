export const DEFAULT_QR_WIDTH = 450;

export const getBucketName = (): string => {
  return process.env.MEDIA_UPLOAD_BUCKET;
};

export const getQrFolder = (): string => {
  return process.env.MEDIA_QR_FOLDER;
};
