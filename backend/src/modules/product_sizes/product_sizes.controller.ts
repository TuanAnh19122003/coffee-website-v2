import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductSizesService } from './product_sizes.service';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';

@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}
  @Get()
  findAll() {
    return this.productSizesService.findAll();
  }

  @Post()
  create(@Body() createProductSizeDto: CreateProductSizeDto) {
    return this.productSizesService.create(createProductSizeDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSizesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductSizeDto: UpdateProductSizeDto) {
    return this.productSizesService.update(+id, updateProductSizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSizesService.remove(+id);
  }
}
