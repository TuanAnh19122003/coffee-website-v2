import { Module } from '@nestjs/common';
import { ProductSizesService } from './product_sizes.service';
import { ProductSizesController } from './product_sizes.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { productSizeProvider } from 'src/provider/product_size.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductSizesController],
  providers: [
    ...productSizeProvider,
    ProductSizesService],
  exports: [ProductSizesService]
})
export class ProductSizesModule {}
