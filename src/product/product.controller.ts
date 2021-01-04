import { Controller, Get, Param } from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from './product.entity';

import { ProductResponse } from './interfaces/product.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth()
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('archive')
  public async getProductsNonAvailable(): Promise<Product[]> {
    return this.productService.findAll(false);
  }

  @Get(':id/archive')
  public async getProductNonAvailable(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, false);
  }

  @Get('all')
  public async getProductsAll(): Promise<ProductResponse[]> {
    return this.productService.findAll(null);
  }

  @Get('all/:id')
  public async getProductAll(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, null);
  }

  @Get()
  public async getProducts(): Promise<ProductResponse[]> {
    return this.productService.findAll(true);
  }

  @Get(':id')
  public async getProduct(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id, true);
  }
}
