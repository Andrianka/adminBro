import uploadFeature from '@admin-bro/upload';
import { join } from 'path';

import { Photo } from '../../../photo/photo.entity';

const image_path = join(__dirname, '../../../../public/');

const createPhotoResource = {
  resource: Photo,
  options: {
    listProperties: ['id', 's3Key', 'bucket', 'path'],
  },
  features: [
    uploadFeature({
      provider: { local: { bucket: image_path } },
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
