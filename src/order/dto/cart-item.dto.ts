import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CartItemDto {
  @IsNotEmpty() @ApiProperty() public productId!: string;
  @IsNotEmpty() @IsInt() @ApiProperty() public quantity: number;
}

export default CartItemDto;
