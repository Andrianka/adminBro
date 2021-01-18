import AdminBro, { unflatten } from 'admin-bro';
import { Product } from '../product/product.entity';
import { changeStatus } from './actions/change-status.action';
import { OrderStatus } from './enums/orderStatus.enum';
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
      edit: { isVisible: false, isAccessible: false },
      changeStatus: {
        isVisible: (context) =>
          [OrderStatus.New, OrderStatus.InProgress].includes(
            context.record.param('status'),
          ),
        actionType: 'record',
        handler: changeStatus,
        component: false,
      },
    },
  },
};

export default OrderResource;
