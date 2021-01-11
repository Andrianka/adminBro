import PostSearchBody from './productSearch.interface';

export default interface ProductSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}
