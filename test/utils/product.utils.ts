import { Category } from 'src/category/category.entity';
import { Product } from '../../src/product/product.entity';

export const createProduct = (
  productData: Partial<Product>,
): Promise<Product> => {
  const product = new Product();
  Object.assign(product, productData);
  return product.save();
};

export const createDefaultProduct = async (
  title: string,
  available: boolean,
  categories: Category[],
): Promise<Product> =>
  createProduct({
    title: title,
    description: 'this is description',
    price: 10,
    quantity: 2,
    isAvailable: available,
    categories: categories,
  });
