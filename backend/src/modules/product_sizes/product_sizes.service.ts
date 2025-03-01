import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';
import { ProductSize } from 'src/database/entities/product_size.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductSizesService {
  constructor(
    @Inject('PRODUCT_SIZE_REPOSITORY')
    private productSizeRepository: Repository<ProductSize>,
    private productsService: ProductsService,
  ) { }

  async findAll() {
    const productSize = this.productSizeRepository.find({
      relations: ['product'],
    });
    return productSize;
  }

  async create(createProductSizeDto: CreateProductSizeDto): Promise<ProductSize> {
    const productSize = this.productSizeRepository.create(createProductSizeDto);
    if (createProductSizeDto.productId) {
      const product = await this.productsService.findOne(createProductSizeDto.productId);
      if (!product) {
        throw new Error('Product not found');
      }
      productSize.product = product;
    }
    return await this.productSizeRepository.save(productSize);
  }

  async findOne(id: number): Promise<ProductSize | null> {
    const productSize = this.productSizeRepository.findOne({
      where: { id },
      relations: ['product'],
    })
    if (!productSize) {
      throw new Error('Product size not found');
    }
    return productSize;
  }

  async update(id: number, updateProductSizeDto: UpdateProductSizeDto): Promise<ProductSize> {
    const productSize = await this.findOne(id);
    if (!productSize) {
      throw new Error('Product size not found');
    }

    // Cập nhật tất cả các trường khác
    Object.assign(productSize, updateProductSizeDto);

    // Xử lý productId nếu có
    if (updateProductSizeDto.productId) {
      const product = await this.productsService.findOne(updateProductSizeDto.productId);
      if (!product) {
        throw new Error('Product not found');
      }
      productSize.product = product;
    }

    return await this.productSizeRepository.save(productSize);
  }


  async remove(id: number): Promise<void> {
    await this.productSizeRepository.delete(id);
  }
}
