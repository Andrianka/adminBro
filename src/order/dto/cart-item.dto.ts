import { IsInt, IsNotEmpty } from 'class-validator';

class CartItemDto {
  @IsNotEmpty() public productId!: string;
  @IsNotEmpty() @IsInt() public quantity: number;
}

export default CartItemDto;
