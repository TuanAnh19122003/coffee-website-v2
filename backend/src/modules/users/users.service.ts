import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/database/entities/user.entity';
import { BcryptHelper } from 'src/utils/bcrypt.helper';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) { }

  async findAll() {
    return await this.userRepository.find();
  }
  async create(createUserDto: CreateUserDto, file?: Express.Multer.File,): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    if (file) {
      user.image = `/uploads/${file.filename}`;
    }
    if (createUserDto.password) {
      console.log('Mật khẩu trước khi mã hóa: ' + createUserDto.password);
      user.password = await BcryptHelper.hashPassword(createUserDto.password);
      console.log('Mật khẩu sau khi mã hóa: ' + user.password);
    }
    return await this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (file) {
      if (user.image) {
        const oldImagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(user.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Ảnh cũ đã được xóa');
        }
      }
      updateUserDto.image = `/uploads/${file.filename}`;
    } else {
      updateUserDto.image = user.image;
    }

    if (updateUserDto.password && typeof updateUserDto.password === 'string') {
      const isHashed = updateUserDto.password.startsWith('$2b$');
      if (!isHashed) {
        updateUserDto.password = await BcryptHelper.hashPassword(updateUserDto.password);
      }
    } else {
      delete updateUserDto.password;
    }

    await this.userRepository.update(id, updateUserDto);

    return await this.userRepository.findOne({ where: { id } });
}


  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user.image) {
      const oldImagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'uploads',
        path.basename(user.image),
      );
      //console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('ảnh và thông tin của người dùng đã được xóa');
      }
    }
    await this.userRepository.delete({ id });
  }
}
