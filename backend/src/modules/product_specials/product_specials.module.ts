import { Module } from '@nestjs/common';
import { ProductSpecialsService } from './product_specials.service';
import { ProductSpecialsController } from './product_specials.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { productSpecialProvider } from 'src/provider/product_special.provider';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [DatabaseModule, ProductsModule],
  controllers: [ProductSpecialsController],
  providers: [
    ...productSpecialProvider,
    ProductSpecialsService
  ],
  exports: [ProductSpecialsService],
})
export class ProductSpecialsModule {}
