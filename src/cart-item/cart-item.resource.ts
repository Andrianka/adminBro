import { CartItem } from './cart-item.entity';

const shopNav = {
  name: 'Manage Shop',
};

const CartItemResource = {
  resource: CartItem,
  options: {
    navigation: shopNav,
    properties: {
      userId: {
        reference: 'User',
      },
      productId: {
        reference: 'Product',
      },
      orderId: {
        reference: 'Order',
      },
    },
    listProperties: ['productId', 'orderId', 'quantity'],
    sort: {
      sortBy: 'createdAt',
      direction: 'desc',
    },
    actions: {
      new: { isVisible: false, isAccessible: false },
      edit: { isVisible: false, isAccessible: false },
      show: { showInDrawer: true },
    },
  },
};

export default CartItemResource;
