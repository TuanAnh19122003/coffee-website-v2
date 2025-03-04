import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductSpecialDto } from './dto/create-product_special.dto';
import { UpdateProductSpecialDto } from './dto/update-product_special.dto';
import { ProductSpecial } from 'src/database/entities/product_special.entity';
import { ProductsService } from '../products/products.service';
import { SpecialsService } from '../specials/specials.service';
@Injectable()
export class ProductSpecialsService {
  constructor(
    @Inject('PRODUCT_SPECIAL_REPOSITORY')
    private productSpecialRepository: Repository<ProductSpecial>,
    private productsService: ProductsService,
    private specialsService: SpecialsService,

  ) { }

  async findAll() {
    const product_special = await this.productSpecialRepository.find({
      relations: ['product','special'],
    })
    return product_special;
  }

  async create(createProductSpecialDto: CreateProductSpecialDto) {
    const { productId, specialId } = createProductSpecialDto;
    if(!productId || !specialId){
      throw new Error('productId and specialId are required');
    }
    const product = await this.productsService.findOne(productId);
    if(!product){
      throw new Error('Product not found');
    }

    const special = await this.specialsService.findOne(specialId);
    if(!special){
      throw new Error('Special not found');
    }

    const productSpecial = this.productSpecialRepository.create({
      product,
      special,
    });
    return await this.productSpecialRepository.save(productSpecial);
  }

  async findOne(id: number): Promise<ProductSpecial | null> {
    const product_special = this.productSpecialRepository.findOne({
      where: { id },
      relations: ['product','special'],
    })
    if(!product_special){
      throw new Error('Product special not found');
    }
    return product_special;
  }

  async update(id: number, updateProductSpecialDto: UpdateProductSpecialDto):Promise<ProductSpecial> {
    const product_special = await this.findOne(id);
    if(!product_special){
      throw new Error('Product special not found');
    }
    if(updateProductSpecialDto.productId){
      const product = await this.productsService.findOne(updateProductSpecialDto.productId);
      if(!product){
        throw new Error('Product not found');
      }
      product_special.product = product;
    }
    if(updateProductSpecialDto.specialId){
      const special = await this.specialsService.findOne(updateProductSpecialDto.specialId);
      if(!special){
        throw new Error('Special not found');
      }
      product_special.special = special;
    }
    return await this.productSpecialRepository.save(product_special);
  }


  async remove(id: number): Promise<void> {
    await this.productSpecialRepository.delete(id);
  }
}
