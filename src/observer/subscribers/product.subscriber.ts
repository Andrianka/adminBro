import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Product } from '../../product/product.entity';
import { ProductElasticIndex } from '../../search/search-index/product.elastic.index';
import { InjectConnection } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly productEsIndex: ProductElasticIndex,
  ) {
    connection.subscribers.push(this);
  }

  public listenTo(): any {
    return Product;
  }

  public async afterInsert(event: InsertEvent<Product>): Promise<any> {
    const result = this.prepareData(event.entity);
    return this.productEsIndex.insertProductDocument(result);
  }

  public async afterUpdate(event: UpdateEvent<Product>): Promise<any> {
    const result = this.prepareData(event.entity);
    return this.productEsIndex.updateProductDocument(result);
  }

  private prepareData(product: Product) {
    const {
      quantity,
      mainImage,
      images,
      cartItems,
      order,
      categoryIds,

      ...result
    } = product;
    result['price'] = parseFloat(result.price.toString());
    return result;
  }
}
