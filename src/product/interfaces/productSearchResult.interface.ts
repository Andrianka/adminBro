import ProductSearch from './productSearch.interface';

export default interface ProductSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: ProductSearch;
    }>;
  };
}
