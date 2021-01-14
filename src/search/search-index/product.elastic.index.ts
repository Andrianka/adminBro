import { Inject, Injectable } from '@nestjs/common';
import { SearchServiceInterface } from '../interface/search.service.interface';

import { Product } from '../../product/product.entity';

const productIndex = {
  _index: 'products',
  _type: 'product',
};

@Injectable()
export class ProductElasticIndex {
  constructor(
    @Inject('SearchServiceInterface')
    private readonly searchService: SearchServiceInterface<any>,
  ) {}

  public async insertProductDocument(product: Product): Promise<any> {
    const data = this.productDocument(product);
    return this.searchService.insertIndex(data);
  }

  public async updateProductDocument(product: Product): Promise<any> {
    const data = this.productDocument(product);
    await this.deleteProductDocument(product.id);
    return this.searchService.insertIndex(data);
  }

  private async deleteProductDocument(prodId: string): Promise<any> {
    const data = {
      index: productIndex._index,
      type: productIndex._type,
      id: prodId.toString(),
    };
    return this.searchService.deleteDocument(data);
  }

  private bulkIndex(productId: string): any {
    return {
      _index: productIndex._index,
      _type: productIndex._type,
      _id: productId,
    };
  }

  private productDocument(product: Product): any {
    const bulk = [];
    bulk.push({
      index: this.bulkIndex(product.id),
    });
    bulk.push(product);

    return {
      body: bulk,
      index: productIndex._index,
      type: productIndex._type,
    };
  }
}
