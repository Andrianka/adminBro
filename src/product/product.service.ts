import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Any, Repository } from 'typeorm';
import { Product } from './product.entity';

import CustomNotFoundException from '../exceptions/customNotFound.exception';
import { ProductPaginationDto } from './dto/product-pagination.dto';
import { PaginatedProductsResult } from './interfaces/paginated-products-result.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

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
