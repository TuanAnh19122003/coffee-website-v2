import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';
import { ProductSize } from 'src/database/entities/product_size.entity';

@Injectable()
export class ProductSizesService {
  constructor(
    @Inject('PRODUCT_SIZE_REPOSITORY')
    private productSizeRepository: Repository<ProductSize>,
  ) {}
  create(createProductSizeDto: CreateProductSizeDto) {
    return 'This action adds a new productSize';
  }

  findAll() {
    return `This action returns all productSizes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productSize`;
  }

  update(id: number, updateProductSizeDto: UpdateProductSizeDto) {
    return `This action updates a #${id} productSize`;
  }

  remove(id: number) {
    return `This action removes a #${id} productSize`;
  }
}
