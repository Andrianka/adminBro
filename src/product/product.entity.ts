import { CartItem } from '../cart-item/cart-item.entity';
import { Order } from '../order/order.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { Category } from 'src/category/category.entity';

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ type: 'varchar', nullable: false })
  public title: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({
    type: 'decimal',
    nullable: false,
    precision: 5,
    scale: 2,
    default: 0,
  })
  public price: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  public quantity: number;

  @Column({ nullable: true, type: 'jsonb' })
  public mainImage: any;

  @Column({ nullable: true, type: 'jsonb' })
  public images: any;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @Column({ name: 'is_available', default: false })
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

  @BeforeUpdate()
  async setAvailable() {
    return this.quantity == 0 && this.isAvailable
      ? (this.isAvailable = false)
      : (this.isAvailable = true);
  }
}
