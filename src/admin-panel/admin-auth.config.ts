// eslint-disable-next-line @typescript-eslint/no-var-requires
const argon2 = require('argon2');
import { CurrentAdmin } from 'admin-bro';
import { Admin } from './admin.entity';
import { getRepository } from 'typeorm';

const createAdmin = async (AdminRepository) => {
  if ((await AdminRepository.count()) === 0) {
    const new_admin = AdminRepository.create({
      email: process.env.ADMIN_EMAIL,
      password: await argon2.hash(process.env.ADMIN_PASSWORD),
    });
    await new_admin.save();
  }
};

const adminAuthConfig = {
  authenticate: async (
    email: string,
    password: string,
  ): Promise<CurrentAdmin | null> => {
    const AdminRepository = getRepository(Admin);

    await createAdmin(AdminRepository);

    const admin = await AdminRepository.findOne({ email });

    const passwordMatch =
      admin && (await argon2.verify(admin.password, password));
    if (passwordMatch && admin) {
      return {
        ...admin,
        title: 'admin',
      };
    }

    return null;
  },
  cookiePassword: process.env.COOKIE_PASSWORD,
  cookieName: process.env.COOKIE_NAME,
};

export default adminAuthConfig;
