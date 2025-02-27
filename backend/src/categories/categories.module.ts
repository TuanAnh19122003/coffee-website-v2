import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { categoryProvider } from 'src/provider/category.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [
    ...categoryProvider,
    CategoriesService
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
