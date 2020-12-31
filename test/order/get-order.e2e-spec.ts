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
    await CartItem.delete({});
    await Order.delete({});
    await Category.delete({});
    await Product.delete({});
    await User.delete({});
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

  describe('/orders/:id show order', () => {
    it('return status 200 for authorized user', async () => {
      return request(app.getHttpServer())
        .get(`/orders/${orders[0].id}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200);
    });

    it('return status 401 for unauthorized user', async () => {
      return request(app.getHttpServer())
        .get(`/orders/${orders[0].id}`)
        .expect(401);
    });

    it('should show order', async () => {
      await request(app.getHttpServer())
        .get(`/orders/${orders[0].id}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(orders[0].id);
        });
    });

    it('should return status 404 for wrong id', async () => {
      await request(app.getHttpServer())
        .get(`/orders/wrong_id`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(404);
    });

    // Fix code
    it('should not show another user order', async () => {
      await request(app.getHttpServer())
        .get(`/orders/${orders[1].id}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).not.toEqual(orders[1].id);
        });
    });
  });
});
