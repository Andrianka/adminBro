import uploadFeature from '@admin-bro/upload';

import { Photo } from '../../../photo/photo.entity';

const createPhotoResource = {
  resource: Photo,
  options: {
    properties: {
      mime: { isVisible: false },
      s3Key: { isVisible: false },
      bucket: { isVisible: false },
      path: { isVisible: false },
    },
    listProperties: ['id', 's3Key', 'bucket', 'file'],
  },
  features: [
    uploadFeature({
      provider: {
        aws: {
          bucket: process.env.AWS_BUCKET as string,
          accessKeyId: process.env.AWS_ACCESS_KEY as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          region: process.env.AWS_REGION as string,
          expires: 10000,
        },
      },
      properties: {
        file: 'file',
        key: 's3Key',
        bucket: 'bucket',
        mimeType: 'mime',
      },
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
  ],
};

export default createPhotoResource;
