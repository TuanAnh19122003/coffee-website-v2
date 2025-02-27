import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { UserrolesModule } from './userroles/userroles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductSizesModule } from './product_sizes/product_sizes.module';
import { ProductSpecialsModule } from './product_specials/product_specials.module';
import { CartModule } from './cart/cart.module';
import { CartItemsModule } from './cart_items/cart_items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order_items/order_items.module';

@Module({
  imports: [UsersModule, RolesModule, UserrolesModule, CategoriesModule, ProductsModule, ProductSizesModule, ProductSpecialsModule, CartModule, CartItemsModule, OrdersModule, OrderItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
