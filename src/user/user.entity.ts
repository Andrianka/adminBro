import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Order } from '../order/order.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true, type: 'jsonb' })
  public photo?: any;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  //Password fields
  @Exclude()
  @Column({ name: 'password_reset_token', type: 'uuid', nullable: true })
  public passwordResetToken!: string;

  @CreateDateColumn({ name: 'password_reset_created_at', nullable: true })
  public passwordResetCreatedAt?: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
