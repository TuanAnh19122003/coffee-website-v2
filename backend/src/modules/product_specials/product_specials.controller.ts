import { Controller, Post, Body, Get, Param, Put, Delete } from "@nestjs/common";
import { CreateProductSpecialDto } from "./dto/create-product_special.dto";
import { UpdateProductSpecialDto } from "./dto/update-product_special.dto";
import { ProductSpecialsService } from "./product_specials.service";

@Controller('product-specials')
export class ProductSpecialsController {
  constructor(private readonly productSpecialsService: ProductSpecialsService) { }

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
  async update(@Param('id') id: number, @Body() updateProductSpecialDto: UpdateProductSpecialDto) {
    return await this.productSpecialsService.update(id, updateProductSpecialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSpecialsService.remove(+id);
  }
}
