import { Body, Controller, Get, Post } from '@nestjs/common';
import { SellService } from './sell.service';
import { SellProductDto } from './dto/sellProduct.dto';

@Controller('sell')
export class SellHistoryController {
  constructor(private readonly sellService: SellService) {}

  @Post()
  async sellProduct(@Body() sellProductDto: SellProductDto): Promise<string> {
    const { barcode, soldSize } = sellProductDto;
    await this.sellService.sellProduct(barcode, soldSize);
    return 'hell';
  }
}
