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
import { HttpException, HttpStatus } from '@nestjs/common';

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

  async changeStatus() {
    if (
      this.status === OrderStatus.New ||
      this.status === OrderStatus.InProgress
    ) {
      switch (this.status) {
        case OrderStatus.New:
          this.status = OrderStatus.InProgress;
          break;
        case OrderStatus.InProgress:
          this.status = OrderStatus.Completed;
          break;
      }
      this.save();
    }
    return this;
  }

  async cancelOrder() {
    if (this.status === OrderStatus.Cancel)
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    if (this.paidStatus !== PaidStatus.Paid) {
      this.status = OrderStatus.Cancel;
    } else {
      this.status = OrderStatus.Cancel;
      console.log('Refund');
      // TODO: REFUND COSTS
    }
    return this.save();
  }

  async reopenOrder() {
    if (this.status === OrderStatus.Cancel) this.status = OrderStatus.New;
    return this.save();
  }
}
