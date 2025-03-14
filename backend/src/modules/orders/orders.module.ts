import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { orderProvider } from 'src/provider/order.provider';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [OrdersController],
  providers: [
    ...orderProvider,
    OrdersService
  ],
  exports: [OrdersService, ...orderProvider]  ,
})
export class OrdersModule {}
