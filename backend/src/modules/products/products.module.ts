import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { productProvider } from 'src/provider/product.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    ...productProvider,
    ProductsService
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
