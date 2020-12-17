import { Controller, Get, Param } from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from './product.entity';

import { ProductResponse } from './interfaces/product.interface';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  public async getProducts(): Promise<ProductResponse[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  public async getProduct(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id);
  }
}
