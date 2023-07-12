import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('products')
  async calculateProductStatistics(): Promise<{
    totalCount: number;
    totalSoldPrice: number;
    totalBoughtPrice: number;
    profit: number;
  }> {
    return this.statisticsService.calculateProductStatistics();
  }
}
