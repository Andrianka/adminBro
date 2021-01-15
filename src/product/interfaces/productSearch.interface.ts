import { Category } from '../../category/category.entity';
import { ProductOption } from '../product.entity';

export default interface ProductSearch {
  id?: string;
  title: string;
  description: string;
  price: number;
  options?: ProductOption;
  isAvailable: boolean;
  categories: Category[];
}
