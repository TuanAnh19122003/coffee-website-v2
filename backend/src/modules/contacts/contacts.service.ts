import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from 'src/database/entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('CONTACT_REPOSITORY')
    private contactRepository: Repository<Contact>,
  ){}

  async findAll() {
    return await this.contactRepository.find();
  }
  async create(createContactDto: CreateContactDto):Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact)
  }

  async findOne(id: number): Promise<Contact | null> {
    const contact = this.contactRepository.findOne({where: {id}})
    if(!contact){
      throw new Error('Contact not found')
    }
    return contact
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact | null> {
    const contact = this.findOne(id)
    if(!contact){
      throw new Error('Contact not found')
    }
    await this.contactRepository.update(id, updateContactDto);
    return {
      ...contact,
      ...updateContactDto
    }
  }

  async remove(id: number):Promise<void> {
    await this.contactRepository.delete(id)
  }
}
