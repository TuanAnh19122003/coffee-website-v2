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

  async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File,): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (file) {
      if (user.image) {
        const oldImagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(user.image));
        // console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('ảnh cũ đã được xóa');
        }
      }
      user.image = `/uploads/${file.filename}`;
    }

    if (updateUserDto.password && updateUserDto.password.trim() !== '') {
      const isHashed = updateUserDto.password.startsWith('$2b$');

      if (!isHashed) {
        // console.log('Mật khẩu trước khi mã hóa:', updateUserDto.password);
        updateUserDto.password = await BcryptHelper.hashPassword(updateUserDto.password);
        // console.log('Mật khẩu sau khi mã hóa:', updateUserDto.password);
      }
    } else {
      console.log('Không cập nhật mật khẩu, giữ nguyên mật khẩu cũ.');
      delete updateUserDto.password;
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
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
