import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import CartItemDto from './cart-item.dto';

class CreateOrderDto {
  @ApiProperty({
    example: '[productId: string, quantity: number]',
    description: 'Cart Items of the order',
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  public cartItems: CartItemDto[];
}

export default CreateOrderDto;
