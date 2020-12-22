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

export class PasswordReset {
  @Exclude()
  @Column({ type: 'uuid', nullable: true })
  public token!: string;

  @CreateDateColumn({ nullable: true })
  public createdAt?: Date;
}

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

  @Exclude()
  @Column((type) => PasswordReset)
  public passwordReset?: PasswordReset;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
