// eslint-disable-next-line @typescript-eslint/no-var-requires
const passwordFeature = require('@admin-bro/passwords');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const argon2 = require('argon2');

import { Admin } from '../../admin.entity';

const AdminResource = {
  resource: Admin,
  options: {
    properties: { password: { isVisible: false } },
  },
  features: [
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
