import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/database/entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) { }

  async findAll() {
    return await this.roleRepository.find();
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto)
    return await this.roleRepository.save(role);
  }


  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id }
    })
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    } 
    return role
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    const role = await this.findOne(id);
    if(!role){
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.roleRepository.update(id, updateRoleDto);
    return {
      ...role,
      ...updateRoleDto
    }
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id)
  }
}
