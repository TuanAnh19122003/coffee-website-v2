import { Module } from '@nestjs/common';
import { UserrolesService } from './userroles.service';
import { UserrolesController } from './userroles.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { userroleProvider } from 'src/provider/userrole.provider';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [DatabaseModule, UsersModule, RolesModule],
  controllers: [UserrolesController],
  providers: [
    ...userroleProvider,
    UserrolesService
  ],
  exports: [UserrolesService],
})
export class UserrolesModule {}
