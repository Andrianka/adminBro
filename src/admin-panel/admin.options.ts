import userResource from './resources/user/user.resource';
import adminResource from './resources/admin/admin.resource';
import productResource from './resources/product/product.resource';

const adminOptions = {
  branding: {
    companyName: 'Shop',
  },
  rootPath: '/admin',
  resources: [userResource, adminResource, productResource],
};

export default adminOptions;
