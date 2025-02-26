import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProvider } from 'src/provider/user.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...userProvider,
    UsersService
  ],
  exports: [UsersService]
})
export class UsersModule {}
