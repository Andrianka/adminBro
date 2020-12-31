import * as request from 'supertest';

import { createApp } from '../utils/app.utils';

import { generateToken } from '../utils/jwt.utils';
import { User } from '../../src/user/user.entity';
import { Product } from '../../src/product/product.entity';
import { Order } from '../../src/order/order.entity';
import { Category } from '../../src/category/category.entity';

import { createUserWithPassword } from '../utils/user.utils';
import { createDefaultCategory } from '../utils/category.utils';
import { createCustomOrder } from '../utils/order.utils';
import { createDefaultProduct } from '../utils/product.utils';
import { CartItem } from '../../src/cart-item/cart-item.entity';

describe('ItemController (e2e)', () => {
  let app;
  let user: User;
  let token;
  let product: Product;
  let order: Order;
  let category: Category;

  beforeAll(async () => {
    app = await createApp();

    user = await createUserWithPassword('username', 'password');
    token = await generateToken(user);

    category = await createDefaultCategory('category_title');

    await app.init();
  });

  beforeEach(async () => {
    product = await createDefaultProduct('product1', true, [category]);

    order = await createCustomOrder(
      [{ productId: product.id, quantity: 1 }],
      user,
    );
  });

  afterEach(async () => {
    await CartItem.delete({});
    await Order.delete({});
    await Product.delete({});
  });

  afterAll(async () => {
    await CartItem.delete({});
    await Order.delete({});
    await Category.delete({});
    await Product.delete({});
    await User.delete({});
    await app.close();
  });

  describe('/orders create new order', () => {
    it('should create order with valid data', async () => {
      return request(app.getHttpServer())
        .post('/orders/')
        .send({
          cartItems: [{ productId: product.id, quantity: 1 }],
        })
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect((res) => {
          expect(res.body.cartItems['propductId']).toEqual(
            order.cartItems['productId'],
          );
          expect(res.body.cartItems['quantity']).toEqual(
            order.cartItems['quantity'],
          );
        });
    });
    it('should save cart item unit price after create order', async () => {
      return request(app.getHttpServer())
        .post('/orders/')
        .send({
          cartItems: [{ productId: product.id, quantity: 1 }],
        })
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect((res) => {
          expect(res.body.cartItems['unitPrice']).toEqual(
            order.cartItems['unitPrice'],
          );
        });
    });
    it('should save cart item total price after create order', async () => {
      return request(app.getHttpServer())
        .post('/orders/')
        .send({
          cartItems: [{ productId: product.id, quantity: 1 }],
        })
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect((res) => {
          expect(res.body.cartItems['totalPrice']).toEqual(
            order.cartItems['totalPrice'],
          );
        });
    });
    it("should't create order with empty product id data", async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({ cartItems: [{ quantity: 1 }] })
        .set({ Authorization: `Bearer ${token}` })
        .expect(400);
    });
    it("should't create order with empty product quantity", async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({ cartItems: [{ productId: product.id }] })
        .set({ Authorization: `Bearer ${token}` })
        .expect(400);
    });
    it("should't create order without user login token", async () => {
      return request(app.getHttpServer()).post('/orders').send({}).expect(401);
    });
  });
});
