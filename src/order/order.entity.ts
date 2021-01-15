import { User } from '../user/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CartItem } from '../cart-item/cart-item.entity';
import { Product } from '../product/product.entity';
import { OrderStatus, PaidStatus } from './enums/orderStatus.enum';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    type: 'decimal',
    name: 'total_price',
    nullable: false,
    precision: 5,
    scale: 2,
    default: 0,
  })
  public totalPrice: number;

  @Column({ type: 'enum', enum: OrderStatus, nullable: false })
  public status?: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaidStatus,
    nullable: false,
    name: 'paid_status',
  })
  public paidStatus?: PaidStatus;

  @Column({ name: 'user_id' })
  public userId: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt?: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order, {
    cascade: true,
    eager: true,
  })
  public cartItems!: CartItem[];

  @OneToMany(() => Product, (product) => product.order)
  public products: Product[];
}
