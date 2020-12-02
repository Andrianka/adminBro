import userResource from './resources/user/user.resource';
import productResource from './resources/product/product.resource';
import photoResource from './resources/photo/photo.resource';

const adminOptions = {
  branding: {
    companyName: 'Shop',
  },
  rootPath: '/admin',
  resources: [userResource, productResource, photoResource],
};

export default adminOptions;
