import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import CreateOrderDto from './dto/create-order.dto';

import JwtAuthenticationGuard from '../auth/guards/jwtAuth.guard';

@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  public async getOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get('user')
  public async getUserOrders(@Req() req: RequestWithUser): Promise<Order[]> {
    return this.orderService.findUserOrders(req.user);
  }

  @Get(':id')
  public async getOrder(@Param('id') id): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Post()
  public async create(
    @Body() orderData: CreateOrderDto,
    @Req() req: RequestWithUser,
  ): Promise<Order> {
    return this.orderService.create(orderData, req.user);
  }
}
