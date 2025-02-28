import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Product } from 'src/database/entities/product.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';



@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService
  ) { }

  async findAll() {
    const products = await this.productRepository.find({
      relations: ['category'],
    })
    return products;
  }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {

    const product = this.productRepository.create(createProductDto);
    if (file) {
      product.image = `/uploads/${file.filename}`;
    }
    if (createProductDto.categoryId) {
      const category = await this.categoriesService.findOne(createProductDto.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      product.category = category;
    }
    return await this.productRepository.save(product);

  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(product.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('ảnh cũ đã được xóa');
        }
      }
      product.image = `/uploads/${file.filename}`;
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(updateProductDto.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      product.category = category;
    }

    await this.productRepository.save(product);
    return product;
  }


  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    if (product.image) {
      const oldImagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'uploads',
        path.basename(product.image),
      );
      //console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('ảnh và thông tin của sản phẩm đã được xóa');
      }
    }
    await this.productRepository.delete(id);
  }
}
