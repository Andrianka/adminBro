import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  RelationId,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Photo } from '../photo/photo.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ unique: true })
  @Column({ type: 'varchar' })
  public username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text' })
  public password: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @OneToOne(() => Photo)
  @JoinColumn()
  public photo: Photo;

  @RelationId((user: User) => user.photo)
  @Column({ nullable: true })
  public photoId: string;
}
