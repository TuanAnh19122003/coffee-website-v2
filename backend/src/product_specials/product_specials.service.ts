import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductSpecialDto } from './dto/create-product_special.dto';
import { UpdateProductSpecialDto } from './dto/update-product_special.dto';
import { ProductSpecial } from 'src/database/entities/product_special.entity';

@Injectable()
export class ProductSpecialsService {
  constructor(
    @Inject('PRODUCT_SPECIAL_REPOSITORY')
    private productSpecialRepository: Repository<ProductSpecial>,
  ) {}
  create(createProductSpecialDto: CreateProductSpecialDto) {
    return 'This action adds a new productSpecial';
  }

  findAll() {
    return `This action returns all productSpecials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productSpecial`;
  }

  update(id: number, updateProductSpecialDto: UpdateProductSpecialDto) {
    return `This action updates a #${id} productSpecial`;
  }

  remove(id: number) {
    return `This action removes a #${id} productSpecial`;
  }
}
