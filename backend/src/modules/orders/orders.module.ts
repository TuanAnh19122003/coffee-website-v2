import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { orderProvider } from 'src/provider/order.provider';
import { UsersModule } from '../users/users.module';
import { OrderItemsModule } from '../order_items/order_items.module';
import { CartModule } from '../cart/cart.module';
import { CartItemsModule } from '../cart_items/cart_items.module';


@Module({
  imports: [DatabaseModule, UsersModule, forwardRef(()=>OrderItemsModule), forwardRef(()=>CartModule), forwardRef(()=>CartItemsModule)],
  controllers: [OrdersController],
  providers: [
    ...orderProvider,
    OrdersService
  ],
  exports: [OrdersService, ...orderProvider]  ,
})
export class OrdersModule {}
