/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'photos' })
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ name: 'key' })
  public s3Key: string;

  @Column()
  public bucket: string;

  @Column()
  public path: string;

  @Column()
  public mime: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @OneToOne(() => User, (user) => user.photo)
  user: User;
}
