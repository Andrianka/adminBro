import * as argon2 from 'argon2';

export const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password);
};
