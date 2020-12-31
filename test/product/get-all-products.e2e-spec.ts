import * as request from 'supertest';

import { createApp } from '../utils/app.utils';
import { createUserWithPassword } from '../utils/user.utils';
import { generateToken } from '../utils/jwt.utils';
import { createDefaultProduct } from '../utils/product.utils';
import { createDefaultCategory } from '../utils/category.utils';

import { User } from '../../src/user/user.entity';
import { Product } from '../../src/product/product.entity';
import { Category } from '../../src/category/category.entity';

describe('ProductController (e2e)', () => {
  let app;
  let user: User;
  let userToken: string;
  let category: Category;
  let products: Product[];

  beforeAll(async () => {
    app = await createApp();
    user = await createUserWithPassword('username', 'password');
    userToken = await generateToken(user);

    category = await createDefaultCategory('category_title');

    products = [
      await createDefaultProduct('product1', true, [category]),
      await createDefaultProduct('product2', true, [category]),
      await createDefaultProduct('product3', false, [category]),
    ];

    await app.init();
  });

  afterAll(async () => {
    await Category.delete({});
    await Product.delete({});
    await User.delete({});
    await app.close();
  });

  describe('/products/all show all products', () => {
    it('return status 200 for authorized user', async () => {
      return request(app.getHttpServer())
        .get(`/products/all/`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200);
    });

    it('return status 200 for unauthorized user', async () => {
      return request(app.getHttpServer()).get(`/products/all/`).expect(200);
    });

    it('should list all available products', async () => {
      await request(app.getHttpServer())
        .get('/products/all/')
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toEqual(3);

          const productResponse = body[0];
          const productResponse2 = body[1];
          const productResponse3 = body[2];

          expect(productResponse.id).toEqual(products[0].id);
          expect(productResponse2.id).toEqual(products[1].id);
          expect(productResponse3.id).toEqual(products[2].id);
        });
    });
  });
});
