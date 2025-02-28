import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { userProvider } from 'src/provider/user.provider';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer-config';

@Module({
  imports: [DatabaseModule, MulterModule.register(multerConfig)],
  controllers: [UsersController],
  providers: [
    ...userProvider,
    UsersService
  ],
  exports: [UsersService]
})
export class UsersModule {}
