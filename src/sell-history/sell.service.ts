import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { SellHistoryEntity } from './sell-history.entity';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SellHistoryEntity)
    private readonly sellHistoryRepository: Repository<SellHistoryEntity>,
  ) {}

  async sellProduct(barcode: string, soldSize: string): Promise<void> {
    // Get the product from the database based on the barcode
    const product = await this.productRepository.findOne({
      where: { barcode },
    });

    if (product) {
      // Check if the sold size exists in the product's sizes array
      if (!product.sizes.includes(soldSize)) {
        throw new NotFoundException('Size not found in product');
      }

      // Find the index of the sold size in the product's sizes array
      const soldSizeIndex = product.sizes.indexOf(soldSize);

      // Remove the sold size from the product's sizes
      product.sizes.splice(soldSizeIndex, 1);

      console.log('kjghjkh', product);
      // Create a sell history entry with the current date and time
      const sellHistoryEntry = this.sellHistoryRepository.create({
        barcode,
        soldSize,
        color: product.color,
        title: product.title,
        sellDate: new Date(), // Assign the current date and time
        productId: product.id, // Assign the product ID
        // Add more properties as needed for additional information
      });

      if (product.sizes.length === 0) {
        // Delete the product from the database
        await this.productRepository.remove(product);
      } else {
        // Save the updated product
        await this.productRepository.save(product);
      }

      // Save the sell history entry
      await this.sellHistoryRepository.save(sellHistoryEntry);
    } else {
      throw new NotFoundException('Product not found');
    }
  }
}