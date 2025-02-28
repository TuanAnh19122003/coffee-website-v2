import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserrolesService } from './userroles.service';
import { CreateUserroleDto } from './dto/create-userrole.dto';
import { UpdateUserroleDto } from './dto/update-userrole.dto';

@Controller('userroles')
export class UserrolesController {
  constructor(private readonly userrolesService: UserrolesService) {}

  @Get()
  findAll() {
    return this.userrolesService.findAll();
  }
  @Post()
  create(@Body() createUserroleDto: CreateUserroleDto) {
    return this.userrolesService.create(createUserroleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userrolesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserroleDto: UpdateUserroleDto) {
    return this.userrolesService.update(+id, updateUserroleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userrolesService.remove(+id);
  }
}
