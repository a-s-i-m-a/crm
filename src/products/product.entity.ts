import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ default: true })
  isInStock: boolean;

  @Column('varchar', { array: true })
  sizes: string[];

  @Column()
  color: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  soldPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  boughtPrice: number;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
