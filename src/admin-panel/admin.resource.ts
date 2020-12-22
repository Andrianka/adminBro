// eslint-disable-next-line @typescript-eslint/no-var-requires
const passwordFeature = require('@admin-bro/passwords');

import * as argon2 from 'argon2';
import uploadFeature from '@admin-bro/upload';
import { Admin } from './admin.entity';

const AdminResource = {
  resource: Admin,
  options: {
    properties: {
      email: { required: true },
      password: { isVisible: false, required: true },
      isActive: { type: 'boolean', required: true },
    },
    listProperties: ['email', 'isActive'],
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
        file: 'photo.file',
        filePath: 'photo.filePath',
        filename: 'photo.filename',
        filesToDelete: 'photo.toDelete',
        key: 'photo.s3Key',
        bucket: 'photo.bucket',
        mimeType: 'photo.mime',
      },
      uploadPath: (record, filename) => `admin/${record.id()}/${filename}`,
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
    passwordFeature({
      properties: {
        encryptedPassword: 'password',
        password: 'newPassword',
      },
      hash: argon2.hash,
    }),
  ],
};

export default AdminResource;
