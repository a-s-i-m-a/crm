import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
