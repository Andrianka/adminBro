import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import CreateOrderDto from './dto/create-order.dto';

import JwtAuthenticationGuard from '../auth/guards/jwtAuth.guard';
// import { ProductResponse } from './interfaces/product.interface';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  public async getOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  public async getOrder(@Param('id') id): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  public async create(
    @Body() orderData: CreateOrderDto,
    @Req() req: RequestWithUser,
  ): Promise<Order> {
    return this.orderService.create(orderData, req.user);
  }
}
