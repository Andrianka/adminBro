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

  async findUserOrders(user: User): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { user: { id: user.id } },
    });
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

    const sum = await this.setTotalPrice(cartItems);

    const newOrder = await this.orderRepository.save({
      cartItems,
      totalPrice: sum,
      user: user,
    });
    return newOrder;
  }

  private async setTotalPrice(cartItems): Promise<number> {
    const sum = cartItems.reduce(
      async (a, { quantity, productId }) =>
        a + quantity * (await (await Product.findOne(productId)).price),
      0,
    );
    return sum;
  }
}
