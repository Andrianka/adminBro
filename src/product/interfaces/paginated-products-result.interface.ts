import { Product } from '../product.entity';

export class PaginatedProductsResult {
  data: Product[];
  page: number;
  limit: number;
  totalCount: number;
}
