import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async calculateProductStatistics(): Promise<{
    totalCount: number;
    totalSoldPrice: number;
    totalBoughtPrice: number;
    profit: number;
  }> {
    const [products, totalCount, totalSoldPrice, totalBoughtPrice] =
      await this.entityManager
        .createQueryBuilder(ProductEntity, 'product')
        .select('COUNT(*)', 'totalCount')
        .groupBy('product.id')
        .select('product')
        .addSelect('SUM(product.soldPrice)', 'totalSoldPrice')
        .addSelect('SUM(product.boughtPrice)', 'totalBoughtPrice')
        .getRawOne();

    const profit =
      (parseFloat(totalSoldPrice) || 0) - (parseFloat(totalBoughtPrice) || 0);

    return {
      totalCount: parseInt(totalCount) || 0,
      totalSoldPrice: parseFloat(totalSoldPrice) || 0,
      totalBoughtPrice: parseFloat(totalBoughtPrice) || 0,
      profit,
    };
  }
}
