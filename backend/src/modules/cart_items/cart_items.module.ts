import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { cartitemProvider } from 'src/provider/cart_item.provider';
import { ProductsModule } from '../products/products.module';
import { ProductSizesModule } from '../product_sizes/product_sizes.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports:[DatabaseModule,ProductsModule, ProductSizesModule, CartModule],
  controllers: [CartItemsController],
  providers: [
    ...cartitemProvider,
    CartItemsService
  ],
  exports: [CartItemsService]
})
export class CartItemsModule {}
