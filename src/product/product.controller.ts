import { Controller, Get, Param, Query } from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from './product.entity';

import { ProductResponse } from './interfaces/product.interface';
import { PaginatedProductsResult } from './interfaces/paginated-products-result.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth()
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // All Products available
  @Get()
  public async getProducts(
    @Query() paginationDto,
  ): Promise<PaginatedProductsResult> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.productService.findAll(true, {
      ...paginationDto,
      limit: paginationDto.limit > 10 ? 10 : paginationDto.limit,
    });
  }

  // All Products unavailable
  @Get('archive')
  public async getProductsNonAvailable(
    @Query() paginationDto,
  ): Promise<PaginatedProductsResult> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.productService.findAll(false, {
      ...paginationDto,
      limit: paginationDto.limit > 10 ? 10 : paginationDto.limit,
    });
  }

  @Get(':id/archive')
  public async getProductNonAvailable(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, false);
  }

  // All Products available and unavailable
  @Get('all')
  public async getProductsAll(
    @Query() paginationDto,
  ): Promise<PaginatedProductsResult> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.productService.findAll(null, {
      ...paginationDto,
      limit: paginationDto.limit > 10 ? 10 : paginationDto.limit,
    });
  }

  @Get('all/:id')
  public async getProductAll(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, null);
  }

  @Get(':id')
  public async getProduct(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, true);
  }
}
