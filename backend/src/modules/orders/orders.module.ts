import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { orderProvider } from 'src/provider/order.provider';
import { UsersModule } from '../users/users.module';
import { OrderItemsModule } from '../order_items/order_items.module';
import { ProductSizesModule } from '../product_sizes/product_sizes.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [DatabaseModule, UsersModule, forwardRef(()=>OrderItemsModule), ProductSizesModule, ProductsModule],
  controllers: [OrdersController],
  providers: [
    ...orderProvider,
    OrdersService
  ],
  exports: [OrdersService, ...orderProvider]  ,
})
export class OrdersModule {}
