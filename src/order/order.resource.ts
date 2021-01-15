import AdminBro, { unflatten } from 'admin-bro';
import { Product } from 'src/product/product.entity';
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
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      cartItems: {
        reference: 'CartItem',
        components: {
          list: AdminBro.bundle('./components/list-products'),
          show: AdminBro.bundle('./components/show-products'),
        },
      },
    },
    listProperties: [
      'userId',
      'cartItems',
      'totalPrice',
      'status',
      'paidStatus',
      'createdAt',
    ],
    sort: {
      sortBy: 'createdAt',
      direction: 'desc',
    },
    actions: {
      show: {
        handler: async (request, response, context) => {
          const { record } = context;

          const { cartItems } = unflatten(record.params);

          const productIds = (cartItems || []).map((item) => item.productId);
          const products = await Product.findByIds(productIds);
          record['params']['products'] = products;
          return {
            record: record.toJSON(context.currentAdmin),
          };
        },
      },
    },
  },
};

export default OrderResource;
