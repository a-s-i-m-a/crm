import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SellService } from './sell.service';
import { SellProductDto } from './dto/sellProduct.dto';

@Controller('sell')
export class SellHistoryController {
  constructor(private readonly sellService: SellService) {}

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
