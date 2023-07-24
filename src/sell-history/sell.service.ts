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

      // Decrease the count by 1
      product.count -= 1;

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
        // Update the product's isInStock property to false
        product.isInStock = false;

        // Save the updated product
        await this.productRepository.save(product);
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

  async returnSoldProduct(
    barcode: string,
    returnedSize: string,
  ): Promise<void> {
    // Get the product from the database based on the barcode
    const product = await this.productRepository.findOne({
      where: { barcode },
    });

    if (product) {
      // Check if the returned size is not already in the product's sizes array
      if (!product.sizes.includes(returnedSize)) {
        // Add the returned size back to the product's sizes
        product.sizes.push(returnedSize);

        // Increment the count by 1
        product.count += 1;

        // Update the product's isInStock property to false
        product.isInStock = true;

        // Save the updated product
        await this.productRepository.save(product);

        // Delete sold product from history
        await this.sellHistoryRepository.delete({
          barcode,
          soldSize: returnedSize,
        });
      }
    } else {
      throw new NotFoundException('Product not found');
    }
  }
}
