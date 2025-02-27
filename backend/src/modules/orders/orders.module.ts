import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { orderProvider } from 'src/provider/order.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [
    ...orderProvider,
    OrdersService
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
