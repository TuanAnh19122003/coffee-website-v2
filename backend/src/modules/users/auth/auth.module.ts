import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users.module';
import { UserrolesModule } from 'src/modules/userroles/userroles.module';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';


@Module({
  imports: [
    UsersModule,
    UserrolesModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/auth/coffee/login');
  }
}
