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
    actions: {
      show: {
        isAccessible: false,
      },
      edit: { showInDrawer: true },
      new: { showInDrawer: true },
    },
    listProperties: ['id', 'title'],
  },
};

export default CategoryResource;
