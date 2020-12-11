import { ResourceWithOptions } from 'admin-bro';
import uploadFeature from '@admin-bro/upload';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const passwordFeature = require('@admin-bro/passwords');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const argon2 = require('argon2');

import { savePhoto } from './user.actions';
import { User } from '../../../user/user.entity';

const UserResource: ResourceWithOptions = {
  resource: User,
  options: {
    properties: {
      username: { isRequired: true },
      password: { isVisible: false, isRequired: true },
      photoId: {
        reference: 'Photo',
        isVisible: { edit: false, list: true },
      },
    },
    listProperties: ['username', 'photoId'],
    actions: {
      new: { after: [savePhoto] },
      edit: {
        after: [savePhoto],
      },
    },
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
        file: 'photo',
        key: 's3Key',
        bucket: 'bucket',
        mimeType: 'mime',
        filePath: 'path',
      },
      uploadPath: (record, filename) =>
        `users/${record.id()}/photo/${filename}`,
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
  ],
};

export default UserResource;
