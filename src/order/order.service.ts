import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Order } from './order.entity';

import CreateOrderDto from './dto/create-order.dto';

import CustomNotFoundException from '../exceptions/customNotFound.exception';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    try {
      return await this.orderRepository.findOne(id);
    } catch (error) {
      throw new CustomNotFoundException('Order');
    }
  }

  async create(orderData: CreateOrderDto, user: User): Promise<Order> {
    const { cartItems, ...createData } = orderData;

    const totalPrice = await this.setTotalPrice(cartItems);

    const newOrder = this.orderRepository.create({
      cartItems,
    });

    newOrder.totalPrice = totalPrice;
    newOrder.user = user;
    return await newOrder.save();
  }

  private async setTotalPrice(cartItems): Promise<number> {
    let totalPrice = 0;
    cartItems.map(async (item, index) => {
      const productPrice = await (await Product.findOne(item.product_id)).price;
      return (totalPrice += item.quantity * productPrice);
    });
    return totalPrice;
  }
}
