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

  async findAll(available: boolean): Promise<Product[]> {
    if (available == null) {
      return await this.productRepository.find();
    }
    return await this.productRepository.find({ isAvailable: available });
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
