import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserroleDto } from './dto/create-userrole.dto';
import { UpdateUserroleDto } from './dto/update-userrole.dto';
import { UserRole } from 'src/database/entities/userrole.entity';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserrolesService {
  constructor(
    @Inject('USERROLE_REPOSITORY')
    private userroleRepository: Repository<UserRole>,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) { }

  async findAll() {
    return await this.userroleRepository.find({
      relations: ['user', 'role'],
    });
  }
  async create(createUserroleDto: CreateUserroleDto): Promise<UserRole> {
    const { userId, roleId } = createUserroleDto;

    if (!userId || !roleId) {
      throw new Error('Thiếu userId hoặc roleId');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error(`Không tìm thấy user với id = ${userId}`);
    }

    const role = await this.rolesService.findOne(roleId);
    if (!role) {
      throw new Error(`Không tìm thấy role với id = ${roleId}`);
    }

    const userRole = this.userroleRepository.create({ user, role });

    return await this.userroleRepository.save(userRole);
  }




  async findOne(id: number): Promise<UserRole> {
    const userRole = await this.userroleRepository.findOne({
      where: { id },
      relations: ['user', 'role'],
    });
    if (!userRole) {
      throw new Error('User role not found');
    }
    return userRole;
  }

  async update(id: number, updateUserroleDto: UpdateUserroleDto): Promise<UserRole> {
    const userRole = await this.findOne(id);
    if (!userRole) {
      throw new Error('User role not found');
    }

    // Xử lý roleId nếu có
    if (updateUserroleDto.roleId) {
      const role = await this.rolesService.findOne(updateUserroleDto.roleId);
      if (!role) {
        throw new Error('Role not found');
      }
      userRole.role = role;
    }

    // Xử lý userId nếu có
    if (updateUserroleDto.userId) {
      const user = await this.usersService.findOne(updateUserroleDto.userId);
      if (!user) {
        throw new Error('User not found');
      }
      userRole.user = user;
    }
    // Cập nhật tất cả các trường khác
    Object.assign(userRole, updateUserroleDto);
    return await this.userroleRepository.save(userRole);
  }

  async remove(id: number): Promise<void> {
    await this.userroleRepository.delete(id);
  }
}
