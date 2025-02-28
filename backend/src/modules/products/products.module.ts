import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { productProvider } from 'src/provider/product.provider';
import { CategoriesModule } from '../categories/categories.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer-config';

@Module({
  imports: [DatabaseModule, CategoriesModule, MulterModule.register(multerConfig)],
  controllers: [ProductsController],
  providers: [
    ...productProvider,
    ProductsService
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
