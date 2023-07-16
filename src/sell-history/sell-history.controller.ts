import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SellService } from './sell.service';
import { SellProductDto } from './dto/sellProduct.dto';
import { SellHistoryEntity } from './sell-history.entity';
import { SellHistoryService } from './sell-history.service';

@Controller('sell')
export class SellHistoryController {
  constructor(
    private readonly sellService: SellService,
    private readonly sellHistoryService: SellHistoryService,
  ) {}

  @Get('history')
  async getSellHistory(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('timePeriod') timePeriod?: string,
  ): Promise<SellHistoryEntity[]> {
    return this.sellHistoryService.getSellHistory(
      page,
      limit,
      startDate,
      endDate,
      timePeriod,
    );
  }

  @Post()
  async sellProduct(@Body() sellProductDto: SellProductDto): Promise<void> {
    const { barcode, soldSize } = sellProductDto;
    await this.sellService.sellProduct(barcode, soldSize);
  }

  @Put('/return/:barcode/:returnedSize')
  async returnSoldSize(
    @Param('barcode') barcode: string,
    @Param('returnedSize') returnedSize: string,
  ): Promise<void> {
    await this.sellService.returnSoldProduct(barcode, returnedSize);
  }
}
