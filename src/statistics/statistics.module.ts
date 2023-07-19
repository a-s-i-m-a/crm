import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellHistoryEntity } from '../sell-history/sell-history.entity';

@Module({
  imports: [ProductsModule, TypeOrmModule.forFeature([SellHistoryEntity])],
  providers: [StatisticsService],
  exports: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
