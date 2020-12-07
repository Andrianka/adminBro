import userResource from './resources/user/user.resource';
import adminResource from './resources/admin/admin.resource';
import productResource from './resources/product/product.resource';
import photoResource from './resources/photo/photo.resource';

const adminOptions = {
  branding: {
    companyName: 'Shop',
  },
  rootPath: '/admin',
  resources: [userResource, adminResource, productResource, photoResource],
};

export default adminOptions;
