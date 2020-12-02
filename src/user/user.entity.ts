import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  @Column({ type: 'varchar' })
  public username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text' })
  public password: string;
}
