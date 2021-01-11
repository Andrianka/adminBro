import { Category } from '../../category/category.entity';

export interface ProductResponse {
  title: string;
  description: string;
  quantity: number;
  mainImage?: [];
  images?: [];
  categories?: Category[];
}
