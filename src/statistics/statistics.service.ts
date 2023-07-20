import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { SellHistoryEntity } from '../sell-history/sell-history.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(SellHistoryEntity)
    private readonly sellHistoryRepository: Repository<SellHistoryEntity>,
  ) {}

  async calculateProductStatistics(): Promise<{
    totalCount: number;
    totalSoldPrice: number;
    totalBoughtPrice: number;
    profit: number;
  }> {
    const products = await this.entityManager
      .createQueryBuilder(ProductEntity, 'product')
      .select('SUM(ARRAY_LENGTH(product.sizes, 1))', 'totalCount')
      .addSelect(
        'SUM(product.soldPrice * ARRAY_LENGTH(product.sizes, 1))',
        'totalSoldPrice',
      )
      .addSelect(
        'SUM(product.boughtPrice * ARRAY_LENGTH(product.sizes, 1))',
        'totalBoughtPrice',
      )
      .groupBy('product.id')
      .getRawMany();

    const totalCount = products.reduce(
      (acc, product) => acc + parseInt(product.totalCount || '0'),
      0,
    );
    const totalSoldPrice = products.reduce(
      (acc, product) => acc + parseFloat(product.totalSoldPrice || '0'),
      0,
    );
    const totalBoughtPrice = products.reduce(
      (acc, product) => acc + parseFloat(product.totalBoughtPrice || '0'),
      0,
    );
    const profit = totalSoldPrice - totalBoughtPrice;

    return {
      totalCount,
      totalSoldPrice,
      totalBoughtPrice,
      profit,
    };
  }

  async getSellHistoryStatistics(timePeriod?: string): Promise<{
    totalCount: number;
    totalBoughtPrice: number;
    totalSoldPrice: number;
    income: number;
  }> {
    // Retrieve sell histories based on the time period (if provided)
    let query = this.sellHistoryRepository.createQueryBuilder('sellHistory');

    if (timePeriod === 'day') {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      query = query.andWhere(
        'sellHistory.sellDate BETWEEN :startOfDay AND :endOfDay',
        {
          startOfDay,
          endOfDay,
        },
      );
    } else if (timePeriod === 'month') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      query = query.andWhere(
        'sellHistory.sellDate BETWEEN :startOfMonth AND :endOfMonth',
        {
          startOfMonth,
          endOfMonth,
        },
      );
    }

    const sellHistories = await query
      .leftJoinAndSelect('sellHistory.product', 'product')
      .getMany();

    const totalBoughtPrice = sellHistories.reduce((total, history) => {
      if (history.product) {
        return total + Number(history.product.boughtPrice);
      } else {
        return total;
      }
    }, 0);

    const totalSoldPrice = sellHistories.reduce((total, history) => {
      if (history.product) {
        return total + Number(history.product.soldPrice);
      } else {
        return total;
      }
    }, 0);

    const income = totalSoldPrice - totalBoughtPrice;
    const totalCount = sellHistories.length;

    return {
      totalCount,
      income,
      totalBoughtPrice,
      totalSoldPrice,
    };
  }
}
