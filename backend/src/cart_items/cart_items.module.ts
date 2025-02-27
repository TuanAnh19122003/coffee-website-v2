import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { cartitemProvider } from 'src/provider/cart_item.provider';

@Module({
  imports:[DatabaseModule],
  controllers: [CartItemsController],
  providers: [
    ...cartitemProvider,
    CartItemsService
  ],
  exports: [CartItemsService]
})
export class CartItemsModule {}
