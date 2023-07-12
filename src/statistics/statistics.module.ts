import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [ProductsModule],
  providers: [StatisticsService],
  exports: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
