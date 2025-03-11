import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { cartProviders } from 'src/provider/cart.provider';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [CartController],
  providers: [
    ...cartProviders,
    CartService
  ],
  exports: [CartService],
})
export class CartModule {}
