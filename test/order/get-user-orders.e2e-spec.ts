import * as request from 'supertest';

import { createApp } from '../utils/app.utils';
import { createUserWithPassword } from '../utils/user.utils';
import { generateToken } from '../utils/jwt.utils';

import { User } from '../../src/user/user.entity';
import { Product } from '../../src/product/product.entity';
import { Category } from '../../src/category/category.entity';
import { CartItem } from '../../src/cart-item/cart-item.entity';
import { Order } from '../../src/order/order.entity';

import { createDefaultCategory } from '../utils/category.utils';
import { createDefaultProduct } from '../utils/product.utils';
import { createCustomOrder } from '../utils/order.utils';

describe('OrderController (e2e)', () => {
  let app;
  let user: User;
  let another_user: User;
  let userToken: string;
  let category: Category;
  let products: Product[];
  let orders: Order[];

  beforeAll(async () => {
    app = await createApp();

    user = await createUserWithPassword('user@mail.com', 'password');
    another_user = await createUserWithPassword(
      'another_user@mail.com',
      'password',
    );
    userToken = await generateToken(user);

    category = await createDefaultCategory('category_title');

    products = [
      await createDefaultProduct('product1', true, [category]),
      await createDefaultProduct('product2', true, [category]),
      await createDefaultProduct('product3', false, [category]),
    ];

    orders = [
      await createCustomOrder(
        [{ productId: products[0].id, quantity: 1 }],
        user,
      ),
      await createCustomOrder(
        [{ productId: products[1].id, quantity: 1 }],
        user,
      ),
    ];
    await createCustomOrder(
      [{ productId: products[0].id, quantity: 1 }],
      another_user,
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

  describe('/orders/user show all orders', () => {
    it('return status 200 for authorized user', async () => {
      return request(app.getHttpServer())
        .get(`/orders/user/`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200);
    });

    it('return status 401 for unauthorized user', async () => {
      return request(app.getHttpServer()).get(`/orders/users/`).expect(401);
    });

    it('should list all user orders', async () => {
      await request(app.getHttpServer())
        .get('/orders/user/')
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toEqual(2);
          expect(body[0].id).toEqual(orders[0].id);
          expect(body[1].id).toEqual(orders[1].id);
        });
    });
  });
});
