import userResource from '../user/user.resource';
import adminResource from './admin.resource';
import productResource from '../product/product.resource';
import orderResource from '../order/order.resource';
import categoryResource from '../category/category.resource';

const adminOptions = {
  branding: {
    companyName: 'Shop',
  },
  rootPath: '/admin',
  resources: [
    userResource,
    adminResource,
    categoryResource,
    productResource,
    orderResource,
  ],
};

export default adminOptions;
