import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    console.log('File created: ', file)
    return this.usersService.create(createUserDto, file);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file?: Express.Multer.File,) {
    console.log('File updated: ', file)
    return this.usersService.update(+id, updateUserDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
