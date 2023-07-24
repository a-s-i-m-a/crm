import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/createProductDto';
import { UpdateProductDto } from './dto/updateProductDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async findAll(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ProductEntity[]> {
    if (query) {
      return this.productsService.findByTitleOrBarcode(query);
    } else {
      return this.productsService.findAll(page, limit);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProductEntity> {
    return this.productsService.findOne(id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<any> {
    return this.productsService.create(createProductDto);
  }

  @Post('group')
  async createFromArray(
    @Body() createProductDto: CreateProductDto[],
  ): Promise<any> {
    return this.productsService.createFromArray(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number | string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.update(id, updateProductDto);
  }

  @Put('remove/:id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.productsService.remove(id);
  }
}
