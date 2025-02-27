import { Module } from '@nestjs/common';
import { UserrolesService } from './userroles.service';
import { UserrolesController } from './userroles.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { userroleProvider } from 'src/provider/userrole.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UserrolesController],
  providers: [
    ...userroleProvider,
    UserrolesService
  ],
  exports: [UserrolesService],
})
export class UserrolesModule {}
