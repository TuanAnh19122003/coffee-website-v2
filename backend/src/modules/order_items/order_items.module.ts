import { Module } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { OrderItemsController } from './order_items.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { ProductSizesModule } from '../product_sizes/product_sizes.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { orderItemProvider } from 'src/provider/order_item.provider';

@Module({
  imports:[DatabaseModule, ProductSizesModule, ProductsModule, OrdersModule],
  controllers: [OrderItemsController],
  providers: [
    ...orderItemProvider,
    OrderItemsService
  ],
  exports: [OrderItemsService,...orderItemProvider]
})
export class OrderItemsModule {}
