import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellHistoryEntity } from './sell-history.entity';

@Injectable()
export class SellHistoryService {
  constructor(
    @InjectRepository(SellHistoryEntity)
    private readonly sellHistoryRepository: Repository<SellHistoryEntity>,
  ) {}

  async getAllSellHistory(): Promise<SellHistoryEntity[]> {
    return this.sellHistoryRepository.find();
  }
}
