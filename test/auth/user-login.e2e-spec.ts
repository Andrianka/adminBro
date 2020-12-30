import * as request from 'supertest';

import { User } from '../../src/user/user.entity';

import { createApp } from '../utils/app.utils';
import { createUserWithPassword } from '../utils/user.utils';

describe('AuthController (e2e)', () => {
  let app;
  let user: User;
  const password = 'password';

  beforeAll(async () => {
    app = await createApp();

    user = await createUserWithPassword('email@mail.com', 'password');
    await app.init();
  });

  afterAll(async () => {
    await User.delete({});
    await app.close();
  });

  describe('/auth/login', () => {
    it('(POST) Unauthorized (password not match)', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong-email@mail.com', password: password })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Wrong credentials provided',
        });
    });

    it('(POST) Unauthorized (password not match)', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'wrong_password' })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Wrong credentials provided',
        });
    });
    it('(POST) Unauthorized (password is blank)', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: '' })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
    it('(POST) Unauthorized (email is blank)', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: '', password: password })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
    it('(POST) Unauthorized (email and password are blank)', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: '', password: '' })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
    it('(POST) Success', () =>
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: password })
        .expect(200)
        .expect((res) => {
          expect(typeof res.body.accessToken).toBe('string');
        }));
  });
});
