import AdminBro, { unflatten } from 'admin-bro';
import { Product } from '../product/product.entity';
import { changeStatus } from './actions/change-status.action';
import { cancelOrder } from './actions/cancel-order.action';
import { reopenOrder } from './actions/reopen-order.action';
import { OrderStatus, PaidStatus } from './enums/orderStatus.enum';
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
      new: { isVisible: false, isAccessible: false },
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
      cancelOrder: {
        isVisible: (context) =>
          context.record.param('status') !== OrderStatus.Cancel,

        actionType: 'record',
        handler: cancelOrder,
        component: false,
      },
      reopenOrder: {
        isVisible: (context) =>
          context.record.param('status') === OrderStatus.Cancel,
        actionType: 'record',
        handler: reopenOrder,
        component: false,
      },
    },
  },
};

export default OrderResource;
