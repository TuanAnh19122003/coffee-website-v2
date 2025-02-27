import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSpecialDto } from './create-product_special.dto';

export class UpdateProductSpecialDto extends PartialType(CreateProductSpecialDto) {}
