import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BeforeUpdate,
  JoinTable,
  RelationId,
  ManyToMany,
} from 'typeorm';
import { CartItem } from '../cart-item/cart-item.entity';
import { Order } from '../order/order.entity';
import { Category } from '../category/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductColor, ProductSize } from './types/productOptions.type';

export class ProductOption {
  @Column({ type: 'enum', enum: ProductColor, nullable: true })
  public color: ProductColor;

  @Column({ type: 'enum', enum: ProductSize, nullable: true })
  public size: ProductSize;
}

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    example: 'car',
    description: 'The title of the Product',
  })
  public title: string;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'this is a description.',
    description: 'The description of the Product',
  })
  public description: string;

  @Column({
    type: 'decimal',
    nullable: false,
    precision: 5,
    scale: 2,
    default: 0,
  })
  @ApiProperty({
    example: 10,
    description: 'The unit price of the Product',
  })
  public price: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  @ApiProperty({
    example: 5,
    description: 'The quantity of the Product',
  })
  public quantity: number;

  @Column({ nullable: true, type: 'jsonb' })
  @ApiProperty()
  public mainImage: any;

  @Column({ nullable: true, type: 'jsonb' })
  @ApiProperty()
  public images: any;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @Column({ name: 'is_available', default: false })
  @ApiProperty()
  public isAvailable: boolean;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  public cartItems!: CartItem[];

  @OneToMany(() => Order, (order) => order.product)
  public order: Order[];

  @RelationId((product: Product) => product.categories)
  categoryIds: number[];

  @ManyToMany(() => Category, (category) => category.products, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  categories: Category[];

  @Column((type) => ProductOption)
  public options?: ProductOption;

  @BeforeUpdate()
  async setAvailable() {
    return this.quantity == 0 && this.isAvailable
      ? (this.isAvailable = false)
      : (this.isAvailable = true);
  }
}
