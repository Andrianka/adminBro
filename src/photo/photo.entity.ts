/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'photos' })
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ nullable: true, name: 'key' })
  public s3Key: string;

  @Column({ nullable: true })
  public bucket: string;

  @Column({ nullable: true })
  public path: string;

  @Column({ nullable: true })
  public mime: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @OneToOne(() => User, (user) => user.photo)
  user: User;
}
