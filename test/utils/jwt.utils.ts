import { JwtService } from '@nestjs/jwt';

import { User } from '../../src/user/user.entity';

const jwtService = new JwtService({
  privateKey: process.env.JWT_SECRET,
});

export const generateToken = (user: User): string => {
  return jwtService.sign({
    id: user.id,
    email: user.email,
  });
};
