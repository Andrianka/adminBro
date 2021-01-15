import ProductAvailableException from '../exceptions/productAvailable.exception';
import CustomNotFoundException from '../exceptions/customNotFound.exception';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
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

  @Column({ name: 'order_id' })
  public orderId!: string;

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
  async updateAfterOrder() {
    const getProduct = await Product.findOne({
      id: this.productId,
      isAvailable: true,
    });
    if (!getProduct) throw new CustomNotFoundException('Product');

    await this.setPrice(getProduct);
    await this.changeProductQuantity(getProduct);
  }

  private async setPrice(getProduct) {
    this.unitPrice = await getProduct.price;
    this.totalPrice = this.unitPrice * this.quantity;
    this.product = getProduct;
  }

  private async changeProductQuantity(getProduct) {
    getProduct.quantity -= this.quantity;

    if (getProduct.quantity < 0)
      throw new ProductAvailableException('Products');

    return await getProduct.save();
  }
}
