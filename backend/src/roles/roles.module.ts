import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { roleProvider } from 'src/provider/role.provider';

@Module({
  imports: [DatabaseModule], 
  controllers: [RolesController],
  providers: [
    ...roleProvider,
    RolesService
  ],
  exports: [RolesService]
})
export class RolesModule {}
