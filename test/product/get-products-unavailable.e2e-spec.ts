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

  describe('/products/archive show unvailable products', () => {
    it('should list all unavailable products for authorized user', async () => {
      await request(app.getHttpServer())
        .get('/products/archive')
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toEqual(1);

          const productResponse = body[0];

          expect(productResponse.id).toEqual(products[2].id);
        });
    });
    it('should list all unavailable products for unauthorized user', async () => {
      await request(app.getHttpServer())
        .get('/products/archive')
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toEqual(1);

          const productResponse = body[0];

          expect(productResponse.id).toEqual(products[2].id);
        });
    });
  });
});
