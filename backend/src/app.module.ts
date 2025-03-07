import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserrolesModule } from './modules/userroles/userroles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductSizesModule } from './modules/product_sizes/product_sizes.module';
import { ProductSpecialsModule } from './modules/product_specials/product_specials.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemsModule } from './modules/cart_items/cart_items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemsModule } from './modules/order_items/order_items.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { AuthModule } from './modules/users/auth/auth.module';
import { SpecialsModule } from './modules/specials/specials.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [UsersModule, AuthModule, RolesModule, UserrolesModule, CategoriesModule, ProductsModule, ProductSizesModule, ProductSpecialsModule, CartModule, CartItemsModule, OrdersModule, OrderItemsModule, ContactsModule, SpecialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/admin'); // Áp dụng cho tất cả route bắt đầu bằng /admin
  }
}
