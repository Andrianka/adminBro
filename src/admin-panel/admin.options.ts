import userResource from './resources/user/user.resource';
import adminResource from './resources/admin/admin.resource';
import productResource from './resources/product/product.resource';
import orderResource from './resources/order/order.resource';

const adminOptions = {
  branding: {
    companyName: 'Shop',
  },
  rootPath: '/admin',
  resources: [userResource, adminResource, productResource, orderResource],
};

export default adminOptions;
