import { hashPassword } from '../utils/password.utils';

import { User } from '../../src/user/user.entity';

export const createUser = (userData: Partial<User>): Promise<User> => {
  const user = new User();
  Object.assign(user, userData);
  return user.save();
};

export const createUserWithPassword = async (
  email: string,
  password: string,
): Promise<User> =>
  createUser({
    email: email,
    password: await hashPassword(password),
  });
