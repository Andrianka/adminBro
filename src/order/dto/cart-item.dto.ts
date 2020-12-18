import { IsInt, IsNotEmpty } from 'class-validator';

class CartItemDto {
  @IsNotEmpty() public product_id!: string;
  @IsNotEmpty() @IsInt() public quantity: number;
}

export default CartItemDto;
