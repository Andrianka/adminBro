import { v4 as uuidv4 } from 'uuid';

export const generateToken = (fallbackForTests?: string) => {
  if (process.env.NODE_ENV === 'test') {
    return fallbackForTests ?? uuidv4();
  }
  return uuidv4();
};
