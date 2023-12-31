import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/createProductDto';
import { UpdateProductDto } from './dto/updateProductDto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(page = 1, limit = 10): Promise<ProductEntity[]> {
    const skip = (page - 1) * limit;
    return this.productRepository.find({
      skip,
      take: limit,
      where: {
        isInStock: true,
      },
    });
  }

  async findOne(id): Promise<ProductEntity> {
    return this.productRepository.findOne({
      where: {
        id,
        isInStock: true,
      },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const id = uuidv4();
    const barcode = this.generateBarcode(10);
    const product = this.productRepository.create({
      ...createProductDto,
      id,
      barcode,
    });
    return this.productRepository.save(product);
  }

  async createFromArray(
    products: CreateProductDto[],
  ): Promise<ProductEntity[]> {
    const createdProducts: ProductEntity[] = [];

    for (const productData of products) {
      const id = uuidv4();
      const barcode = this.generateBarcode(10);

      const product = this.productRepository.create({
        ...productData,
        id,
        barcode,
      });

      const createdProduct = await this.productRepository.save(product);
      createdProducts.push(createdProduct);
    }

    return createdProducts;
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

  async remove(id): Promise<boolean> {
    const result = await this.productRepository.update(id, {
      isInStock: false,
    });

    if (result.affected === 0) {
      return false;
    }

    return true;
  }

  generateBarcode(length: number): string {
    const characters = this.configService.get('CHARACTERS');
    let barcode = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      barcode += characters.charAt(randomIndex);
    }

    return barcode;
  }

  async findByTitleOrBarcode(searchQuery: string): Promise<ProductEntity[]> {
    return this.productRepository.find({
      where: [
        { title: Like(`%${searchQuery}%`), isInStock: true },
        { barcode: searchQuery, isInStock: true },
      ],
    });
  }
}
