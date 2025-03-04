import { Module } from '@nestjs/common';
import { SpecialsService } from './specials.service';
import { SpecialsController } from './specials.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { specialProvider } from 'src/provider/special.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [SpecialsController],
  providers: [
    ...specialProvider,
    SpecialsService
  ],
  exports: [SpecialsService]
})
export class SpecialsModule {}
