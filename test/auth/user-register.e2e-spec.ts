import * as request from 'supertest';
import { createApp } from '../utils/app.utils';
import { createUser } from '../utils/user.utils';
import { hashPassword } from '../utils/password.utils';

import { User } from '../../src/user/user.entity';

describe('AuthController (e2e)', () => {
  let app;
  let user: User;
  const password = 'password';

  beforeAll(async () => {
    app = await createApp();
    await createUser({
      email: 'email-existed@mail.com',
      password: await hashPassword(password),
      firstName: '',
      lastName: '',
    });
    await app.init();
  });

  afterAll(async () => {
    await User.delete({});
    await app.close();
  });

  describe('/auth/register a new user', () => {
    it('should return status 400 if email is existed', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'email-existed@mail.com',
          password: 'password',
          firstName: '',
          lastName: '',
        });
      expect(res.status).toBe(400);
    });
    it('should return status 400 if password blank', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'email@mail.com',
          password: '',
          firstName: '',
          lastName: '',
        });

      expect(res.status).toBe(400);
    });

    it('should return status 400 if email blank', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: '',
          password: password,
          firstName: '',
          lastName: '',
        });

      expect(res.status).toBe(400);
    });
    it('should return status 400 if email and password blank', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        });

      expect(res.status).toBe(400);
    });
    it('should return status 400 if password less than 8 symbols', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'email@mail.com',
          password: '1'.repeat(7),
          firstName: '',
          lastName: '',
        });

      expect(res.status).toBe(400);
    });
    it('successed', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@mail.com',
          password: password,
          firstName: '',
          lastName: '',
        });

      expect(res.status).toBe(201);
      expect(res.body.email).toEqual('test@mail.com');
    });
  });
});
