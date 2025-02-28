import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/database/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find();
  }

  async create(createCategoryDto: CreateCategoryDto):Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findOne(id: number):Promise<Category> {
    const category = await this.categoryRepository.findOne({where: {id}});
    if(!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if(!category) {
      throw new Error('Category not found');
    }
    await this.categoryRepository.update(id, updateCategoryDto);
    return {
     ...category,
     ...updateCategoryDto
    }
  }

  async remove(id: number):Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
