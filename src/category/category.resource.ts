import { Category } from './category.entity';

const shopNav = {
  name: 'Manage Shop',
};

const CategoryResource = {
  resource: Category,
  options: {
    navigation: shopNav,
    properties: {
      title: { isRequired: true, isTitle: true },
    },
    listProperties: ['title'],
  },
};

export default CategoryResource;
