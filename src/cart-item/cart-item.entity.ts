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
  AfterInsert,
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
    const getProduct = await this.findProduct();
    await this.setPrice(getProduct);
    await this.checkProductQuantity(getProduct);
  }
  @AfterInsert()
  async updateProductQuantity() {
    const getProduct = await this.findProduct();
    await this.changeProductQuantity(getProduct);
  }

  private async findProduct() {
    const product = await Product.findOne({
      id: this.productId,
      isAvailable: true,
    });
    if (!product) throw new CustomNotFoundException('Product');
    return product;
  }

  private async setPrice(getProduct) {
    this.unitPrice = await getProduct.price;
    this.totalPrice = this.unitPrice * this.quantity;
    this.product = getProduct;
  }

  private async changeProductQuantity(getProduct) {
    const product = await this.checkProductQuantity(getProduct);
    return await product.save();
  }

  private async checkProductQuantity(getProduct) {
    getProduct.quantity -= this.quantity;

    if (getProduct.quantity < 0)
      throw new ProductAvailableException('Products');
    return getProduct;
  }
}
