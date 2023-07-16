import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SellHistoryEntity } from './sell-history.entity';

@Injectable()
export class SellHistoryService {
  constructor(
    @InjectRepository(SellHistoryEntity)
    private readonly sellHistoryRepository: Repository<SellHistoryEntity>,
  ) {}

  async getSellHistory(
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    timePeriod?: string,
  ): Promise<SellHistoryEntity[]> {
    const skip = (page - 1) * limit;

    let query = this.sellHistoryRepository
      .createQueryBuilder('sell_history')
      .skip(skip)
      .take(limit)
      .orderBy('sell_history.sellDate', 'DESC');

    if (startDate && endDate) {
      query = query.andWhere(
        'sell_history.sellDate BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    if (timePeriod === 'month') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      query = query.andWhere(
        'sell_history.sellDate BETWEEN :startOfMonth AND :endOfMonth',
        {
          startOfMonth,
          endOfMonth,
        },
      );
    } else if (timePeriod === 'week') {
      const now = new Date();
      const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay(),
      );
      const endOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (6 - now.getDay()),
      );

      query = query.andWhere(
        'sell_history.sellDate BETWEEN :startOfWeek AND :endOfWeek',
        {
          startOfWeek,
          endOfWeek,
        },
      );
    } else if (timePeriod === 'day') {
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
        'sell_history.sellDate BETWEEN :startOfDay AND :endOfDay',
        {
          startOfDay,
          endOfDay,
        },
      );
    }

    return query.getMany();
  }
}
