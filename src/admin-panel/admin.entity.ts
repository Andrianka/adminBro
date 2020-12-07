import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id?: string;

  @Column({ unique: true })
  @Column({ type: 'varchar' })
  public email: string;

  @Column({ type: 'varchar', nullable: true })
  public password: string;
}
