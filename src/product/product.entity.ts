// import { Photo } from 'src/photo/photo.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ type: 'varchar', nullable: false })
  public title: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ nullable: true, type: 'jsonb' })
  public mainImage: any;

  @Column({ nullable: true, type: 'jsonb' })
  public images: any;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
