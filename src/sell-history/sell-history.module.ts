import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellService } from './sell.service';
import { SellHistoryEntity } from './sell-history.entity';
import { ProductEntity } from '../products/product.entity';
import { SellHistoryController } from './sell-history.controller';
import { SellHistoryService } from './sell-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, SellHistoryEntity])],
  controllers: [SellHistoryController],
  providers: [SellService, SellHistoryService],
})
export class SellHistoryModule {}
