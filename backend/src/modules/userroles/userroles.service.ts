import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserroleDto } from './dto/create-userrole.dto';
import { UpdateUserroleDto } from './dto/update-userrole.dto';
import { UserRole } from 'src/database/entities/userrole.entity';

@Injectable()
export class UserrolesService {
  constructor(
    @Inject('USERROLE_REPOSITORY')
    private userroleRepository: Repository<UserRole>,
    
  ) {}
  create(createUserroleDto: CreateUserroleDto) {
    return 'This action adds a new userrole';
  }

  findAll() {
    return `This action returns all userroles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userrole`;
  }

  update(id: number, updateUserroleDto: UpdateUserroleDto) {
    return `This action updates a #${id} userrole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userrole`;
  }
}
