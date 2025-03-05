import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Product } from 'src/database/entities/product.entity';
import { In, Repository } from 'typeorm';
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
    return await this.productRepository.find();
  }

  async findProductsByCategory(categoryId?: number) {
    const whereCondition = categoryId ? { category: { id: categoryId } } : {};
    console.log("whereCondition:", whereCondition);

    const products = await this.productRepository.find({
      where: whereCondition,
      relations: ['category', 'sizes', 'specials.special'],
    });

    console.log("Danh sách sản phẩm:", products);

    return products.map((product) => {
      let defaultSize = product.sizes.find((size) => size.size === 'S') || product.sizes[0];
      const originalPrice = defaultSize ? defaultSize.price : 0;

      const activeSpecial = product.specials?.find(
        (ps) => ps.special && ps.special.start_date <= new Date() && ps.special.end_date >= new Date()
      );

      const discountPercentage = activeSpecial?.special?.discount_percentage ?? 0;
      const discountedPrice = originalPrice * (1 - discountPercentage / 100);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        size: defaultSize ? defaultSize.size : 'N/A',
        original_price: originalPrice,
        discounted_price: discountedPrice,
        special_name: activeSpecial?.special?.special_name || 'Không có khuyến mãi',
        start_date: activeSpecial?.special?.start_date || null,
        end_date: activeSpecial?.special?.end_date || null
      };
    });
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
      relations: ['category', 'sizes', 'specials.special'],
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
    } else {
      updateProductDto.image = product.image;
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(updateProductDto.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      product.category = category;
    }
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return await this.productRepository.find({
      where: { id: In(ids) },
    });
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
