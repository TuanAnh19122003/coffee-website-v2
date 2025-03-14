import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { cartProviders } from 'src/provider/cart.provider';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { OrderItemsModule } from '../order_items/order_items.module';

@Module({
  imports: [DatabaseModule, UsersModule, OrdersModule, OrderItemsModule],
  controllers: [CartController],
  providers: [
    ...cartProviders,
    CartService
  ],
  exports: [CartService],
})
export class CartModule {}
