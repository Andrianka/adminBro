import { Product } from '../../src/product/product.entity';
import { Order } from '../../src/order/order.entity';
import { User } from '../../src/user/user.entity';

export const createOrder = async (
  orderData: Partial<Order>,
  user: User,
): Promise<Order> => {
  const { cartItems } = orderData;

  const newOrder = await Order.create({
    cartItems,
    totalPrice: await setTotalPrice(orderData.cartItems),
    user: user,
  });
  return newOrder.save();
};

export const createCustomOrder = async (
  cartItems,
  user: User,
): Promise<Order> => {
  return createOrder({ cartItems: cartItems }, user);
};

const setTotalPrice = async (cartItems): Promise<number> => {
  const sum = cartItems.reduce(
    async (a, { quantity, productId }) =>
      a + quantity * (await (await Product.findOne(productId)).price),
    0,
  );
  return sum;
};
