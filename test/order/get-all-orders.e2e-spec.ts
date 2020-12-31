import * as request from 'supertest';

import { createApp } from '../utils/app.utils';
import { createUserWithPassword } from '../utils/user.utils';
import { generateToken } from '../utils/jwt.utils';

import { User } from '../../src/user/user.entity';

import { Product } from '../../src/product/product.entity';
import { Category } from '../../src/category/category.entity';

import { Order } from '../../src/order/order.entity';
import { createDefaultCategory } from '../utils/category.utils';
import { createDefaultProduct } from '../utils/product.utils';
import { createCustomOrder } from '../utils/order.utils';
import { CartItem } from '../../src/cart-item/cart-item.entity';

describe('OrderController (e2e)', () => {
  let app;
  let user: User;
  let userToken: string;

  let products: Product[];
  let order: Order;

  beforeAll(async () => {
    app = await createApp();
    user = await createUserWithPassword('username', 'password');
    userToken = await generateToken(user);

    const category = await createDefaultCategory('category_title');

    products = [
      await createDefaultProduct('product1', true, [category]),
      await createDefaultProduct('product2', true, [category]),
      await createDefaultProduct('product3', false, [category]),
    ];

    order = await createCustomOrder(
      [{ productId: products[0].id, quantity: 1 }],
      user,
    );
    await app.init();
  });

  afterAll(async () => {
    await CartItem.delete({});
    await Order.delete({});
    await Category.delete({});
    await Product.delete({});
    await User.delete({});
    await app.close();
  });

  describe('/orders/ show all orders', () => {
    it('return status 200 for authorized user', async () => {
      return request(app.getHttpServer())
        .get(`/orders/`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200);
    });

    it('return status 401 for unauthorized user', async () => {
      return request(app.getHttpServer()).get(`/orders/`).expect(401);
    });

    it('should list all orders', async () => {
      await request(app.getHttpServer())
        .get('/orders/')
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toEqual(1);
          expect(body[0]['order']['id']).toEqual(order.id);
        });
    });
  });
});
