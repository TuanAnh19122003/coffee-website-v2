import { Test, TestingModule } from '@nestjs/testing';
import { ProductSpecialsController } from './product_specials.controller';
import { ProductSpecialsService } from './product_specials.service';

describe('ProductSpecialsController', () => {
  let controller: ProductSpecialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSpecialsController],
      providers: [ProductSpecialsService],
    }).compile();

    controller = module.get<ProductSpecialsController>(ProductSpecialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
