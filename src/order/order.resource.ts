import { Order } from './order.entity';

const shopNav = {
  name: 'Manage Shop',
};

const OrderResource = {
  resource: Order,
  options: {
    navigation: shopNav,
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
