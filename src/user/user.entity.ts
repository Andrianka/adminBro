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

import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    example: 'test@mail.com',
    description: 'The email of the User',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the User',
  })
  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @ApiProperty({
    description: 'The first name of the User',
  })
  @Column({ nullable: true })
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the User',
  })
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
