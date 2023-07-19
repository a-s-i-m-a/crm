import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@Entity('sell_history')
export class SellHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  barcode: string;

  @Column()
  soldSize: string;

  @Column()
  color: string;

  @Column()
  title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sellDate: Date;

  @Column()
  productId: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
