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

  describe('/products/:id/ show available product', () => {
    it('should show product for authorized user', async () => {
      await request(app.getHttpServer())
        .get(`/products/${products[0].id}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(products[0].id);
        });
    });
    it('should show product for unauthorized user', async () => {
      await request(app.getHttpServer())
        .get(`/products/${products[0].id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(products[0].id);
        });
    });
    it('should not show product for authorized user', async () => {
      await request(app.getHttpServer())
        .get(`/products/${products[2].id}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(404);
    });
    it('should not show product for unauthorized user', async () => {
      await request(app.getHttpServer())
        .get(`/products/${products[2].id}`)
        .expect(404);
    });
  });

  afterAll(async () => {
    User.delete({});
    Category.delete({});
    Product.delete({});

    await app.close();
  });
});
