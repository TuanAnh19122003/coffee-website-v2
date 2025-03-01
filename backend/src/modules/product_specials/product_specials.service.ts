import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductSpecialDto } from './dto/create-product_special.dto';
import { UpdateProductSpecialDto } from './dto/update-product_special.dto';
import { ProductSpecial } from 'src/database/entities/product_special.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductSpecialsService {
  constructor(
    @Inject('PRODUCT_SPECIAL_REPOSITORY')
    private productSpecialRepository: Repository<ProductSpecial>,
    private productsService: ProductsService,
  ) {}

  async findAll() {
    const productSpecial = await this.productSpecialRepository.find({
      relations: ['product'],
    })
    return productSpecial;
  }

  async create(createProductSpecialDto: CreateProductSpecialDto):Promise<ProductSpecial> {
    const productSpecial = this.productSpecialRepository.create(createProductSpecialDto);
    if (createProductSpecialDto.productId){
      const product = await this.productsService.findOne(createProductSpecialDto.productId);
      if (!product) {
        throw new Error('Product not found');
      }
      productSpecial.product = product;
    }
    return await this.productSpecialRepository.save(productSpecial);
  }

  async findOne(id: number):Promise<ProductSpecial> {
    const productSpecial = await this.productSpecialRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!productSpecial) {
      throw new Error('Product special not found');
    }
    return productSpecial;
  }

  async update(id: number, updateProductSpecialDto: UpdateProductSpecialDto): Promise<ProductSpecial> {
    const productSpecial = await this.findOne(id);
    if (!productSpecial) {
        throw new Error('Product special not found');
    }

    // Cập nhật tất cả các trường khác
    Object.assign(productSpecial, updateProductSpecialDto);

    // Xử lý productId nếu có
    if (updateProductSpecialDto.productId) {
        const product = await this.productsService.findOne(updateProductSpecialDto.productId);
        if (!product) {
            throw new Error('Product not found');
        }
        productSpecial.product = product;
    }

    return await this.productSpecialRepository.save(productSpecial);
}


  async remove(id: number):Promise<void> {
    await this.productSpecialRepository.delete(id);
  }
}
