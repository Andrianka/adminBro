import AdminBro, { ResourceWithOptions } from 'admin-bro';
import uploadFeature from '@admin-bro/upload';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const passwordFeature = require('@admin-bro/passwords');
import * as argon2 from 'argon2';

import { User } from './user.entity';

const UserResource: ResourceWithOptions = {
  resource: User,
  options: {
    navigation: {
      name: null,
      icon: 'User',
    },
    properties: {
      email: { isRequired: true },
      password: { isVisible: false, isRequired: true },
    },
    listProperties: ['photo', 'email', 'firstName', 'lastName'],

    sort: {
      sortBy: 'createdAt',
      direction: 'desc',
    },
  },
  features: [
    passwordFeature({
      properties: {
        encryptedPassword: 'password',
        password: 'newPassword',
      },
      hash: argon2.hash,
    }),
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
      uploadPath: (record, filename) =>
        `users/${record.id()}/photo/${filename}`,
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
  ],
};

export default UserResource;
