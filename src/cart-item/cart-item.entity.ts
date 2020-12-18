import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

@Entity({ name: 'cart_item' })
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false, type: 'integer' })
  public quantity: number;

  @Column({
    type: 'decimal',
    name: 'unit_price',
    nullable: false,
    precision: 5,
    scale: 2,
    default: 0,
  })
  public unitPrice?: number;

  @Column({
    type: 'decimal',
    name: 'total_price',
    nullable: false,
    precision: 5,
    scale: 2,
    default: 0,
  })
  public totalPrice?: number;

  @Column({ name: 'product_id' })
  public productId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt?: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt?: Date;

  @ManyToOne(() => Order, (order) => order.cartItems, {
    primary: true,
  })
  @JoinColumn({ name: 'order_id' })
  public order!: Order;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    primary: true,
  })
  @JoinColumn({ name: 'product_id' })
  public product!: Product;

  @BeforeInsert()
  async setPrice() {
    const getProduct = await Product.findOne(this.productId);
    this.unitPrice = await getProduct.price;
    console.log('cart item entity price', this.unitPrice);
    this.totalPrice = this.unitPrice * this.quantity;
    this.product = getProduct;
    console.log('prod', this.product);
  }
}
