import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users.module';
import { UserrolesModule } from 'src/modules/userroles/userroles.module';
import { AuthController } from './auth.controller';


@Module({
  imports: [
    UsersModule,
    UserrolesModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
