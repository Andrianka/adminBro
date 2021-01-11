import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchServiceInterface } from '../search/interface/search.service.interface';
import { ConfigSearch } from '../search/config/config.search';

@Injectable()
export class SearchService
  extends ElasticsearchService
  implements SearchServiceInterface<any> {
  constructor() {
    super(ConfigSearch.searchConfig(process.env.ELASTICSEARCH_NODE));
  }

  public async insertIndex(bulkData: any): Promise<any> {
    return this.bulk(bulkData)
      .then((res) => res)
      .catch((err) => {
        console.log(err);
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async updateIndex(updateData: any): Promise<any> {
    return this.update(updateData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async searchIndex(searchData: any): Promise<any> {
    return this.search(searchData)
      .then((res) => {
        const results = [];
        const hits = res.body.hits.hits;
        hits.map((item) => {
          results.push(item._source);
        });
        return { results, total: res.body.hits.total.value };
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async deleteIndex(indexData: any): Promise<any> {
    return this.indices
      .delete(indexData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async deleteDocument(indexData: any): Promise<any> {
    return this.delete(indexData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
