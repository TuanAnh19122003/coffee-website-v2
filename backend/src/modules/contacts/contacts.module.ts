import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { contactProvider } from 'src/provider/contact.provider';

@Module({
  imports: [DatabaseModule],
  exports: [ContactsService],  // Expose ContactsService to other modules for dependency injection.
  controllers: [ContactsController],
  providers: [
    ...contactProvider,
    ContactsService
  ],
})
export class ContactsModule {}
