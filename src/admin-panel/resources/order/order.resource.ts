import { Order } from '../../../order/order.entity';

const OrderResource = {
  resource: Order,
  options: {
    properties: {
      userId: {
        reference: 'User',
      },
      products: {
        reference: 'Product',
      },
    },
    listProperties: ['userId', 'products', 'totalPrice', 'createdAt'],
  },
};

export default OrderResource;
