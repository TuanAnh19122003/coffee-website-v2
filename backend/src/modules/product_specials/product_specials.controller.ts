import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductSpecialsService } from './product_specials.service';
import { CreateProductSpecialDto } from './dto/create-product_special.dto';
import { UpdateProductSpecialDto } from './dto/update-product_special.dto';

@Controller('product-specials')
export class ProductSpecialsController {
  constructor(private readonly productSpecialsService: ProductSpecialsService) {}

  @Post()
  create(@Body() createProductSpecialDto: CreateProductSpecialDto) {
    return this.productSpecialsService.create(createProductSpecialDto);
  }

  @Get()
  findAll() {
    return this.productSpecialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSpecialsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductSpecialDto: UpdateProductSpecialDto) {
    return this.productSpecialsService.update(+id, updateProductSpecialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSpecialsService.remove(+id);
  }
}
