import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Product } from './product.entity';

import CustomNotFoundException from '../exceptions/customNotFound.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    try {
      return await this.productRepository.findOne(id);
    } catch (error) {
      throw new CustomNotFoundException('Product');
    }
  }
}
