import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Any, Repository } from 'typeorm';
import { Product } from './product.entity';

import CustomNotFoundException from '../exceptions/customNotFound.exception';
import { ProductPaginationDto } from './dto/product-pagination.dto';
import { PaginatedProductsResult } from './interfaces/paginated-products-result.interface';
import { ProductResponse } from './interfaces/product.interface';
import { SearchServiceInterface } from '../search/interface/search.service.interface';

export const productIndex = {
  _index: 'product',
  _type: 'products',
};

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject('SearchServiceInterface')
    private readonly searchService: SearchServiceInterface<any>,
  ) {}

  private productSearchObject(q) {
    const body = {
      size: 12,
      query: {
        multi_match: {
          query: q,
          fields: ['title', 'description'],
        },
      },
    };
    return { index: productIndex._index, body, q };
  }

  async searchProducts(search = '') {
    const searchData = this.productSearchObject(search);
    return await this.searchService.searchIndex(searchData);
  }

  async getProducts(): Promise<ProductResponse[]> {
    return await this.productRepository.find();
  }

  async findAll(
    available: boolean,
    paginationDto: ProductPaginationDto,
  ): Promise<PaginatedProductsResult> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const totalCount = await this.productRepository.count();
    const products = await this.productRepository.find({
      where: {
        isAvailable: available !== null ? available : Any(['true', 'false']),
      },
      order: { createdAt: 'DESC' },
      skip: skippedItems,
      take: paginationDto.limit,
    });

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: products,
    };
  }

  async findOne(id: string, available: boolean): Promise<Product> {
    if (available == null) {
      // eslint-disable-next-line no-var
      var product = await this.productRepository.findOne(id);
    }

    product = await this.productRepository.findOne({
      id: id,
      isAvailable: available,
    });

    if (product == undefined) throw new CustomNotFoundException('Product');

    return product;
  }
}
