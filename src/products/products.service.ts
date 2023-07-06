import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/createProductDto';
import { UpdateProductDto } from './dto/updateProductDto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(page = 1, limit = 10): Promise<ProductEntity[]> {
    const skip = (page - 1) * limit;
    return this.productRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id): Promise<ProductEntity> {
    return this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      return null;
    }
    const updatedProduct = Object.assign(product, updateProductDto);
    return this.productRepository.save(updatedProduct);
  }

  async remove(id): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      return null;
    }
    await this.productRepository.remove(product);
    return product;
  }
}
