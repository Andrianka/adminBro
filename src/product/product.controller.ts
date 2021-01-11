import { Controller, Get, Param, Query } from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from './product.entity';
import { PaginatedProductsResult } from './interfaces/paginated-products-result.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth()
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  //Search products
  @Get('search')
  public async searchProducts(
    @Query() paginationDto,
    @Query('q') search: string,
  ) {
    return this.productService.searchProducts(search);
  }

  // All Products available
  @Get()
  public async getProducts(
    @Query() paginationDto,
  ): Promise<PaginatedProductsResult> {
    return this.paginate(true, paginationDto);
  }

  // All Products unavailable
  @Get('archive')
  public async getProductsNonAvailable(
    @Query() paginationDto,
  ): Promise<PaginatedProductsResult> {
    return this.paginate(false, paginationDto);
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
    return this.paginate(null, paginationDto);
  }

  @Get('all/:id')
  public async getProductAll(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, null);
  }

  @Get(':id')
  public async getProduct(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, true);
  }

  private paginate(available: boolean, paginationDto) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.productService.findAll(available, {
      ...paginationDto,
      limit: paginationDto.limit > 10 ? 10 : paginationDto.limit,
    });
  }
}
