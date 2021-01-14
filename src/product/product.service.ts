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
  _index: 'products',
  _type: 'product',
};

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject('SearchServiceInterface')
    private readonly searchService: SearchServiceInterface<any>,
  ) {}

  private getFilter(title, field, filter) {
    const obj = {};
    const result = [];
    if (filter == 'terms') {
      const searchData = title.replace(/\s+/g, '').split(',');
      obj[field] = searchData;
      result.push({ terms: obj });
    }
    if (filter == 'range') {
      obj[field] = {
        gte: title[0] ? title[0] : 0,
        lte: title[1] ? title[1] : undefined,
      };
      result.push({ range: obj });
    }
    return result[0];
  }

  private checkObject(search) {
    const filters = [];
    filters.push({
      term: {
        isAvailable: 'true',
      },
    });
    if (search.size)
      filters.push(this.getFilter(search.size, 'options.size', 'terms'));
    if (search.color)
      filters.push(this.getFilter(search.color, 'options.color', 'terms'));
    if (search.weight_from || search.weight_to)
      filters.push(
        this.getFilter(
          [search.weight_from, search.weight_to],
          'options.weight',
          'range',
        ),
      );
    if (search.price_from || search.price_to)
      filters.push(
        this.getFilter([search.price_from, search.price_to], 'price', 'range'),
      );

    return filters;
  }
  private productSearchObject(search) {
    const body = {
      size: 12,
      query: {
        bool: {
          filter: this.checkObject(search),
          must: {
            multi_match: {
              query: search.q,
              fields: ['title', 'description'],
            },
          },
        },
      },
    };
    return { index: productIndex._index, body };
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
