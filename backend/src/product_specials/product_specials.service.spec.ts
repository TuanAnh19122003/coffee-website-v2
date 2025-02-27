import { Test, TestingModule } from '@nestjs/testing';
import { ProductSpecialsService } from './product_specials.service';

describe('ProductSpecialsService', () => {
  let service: ProductSpecialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSpecialsService],
    }).compile();

    service = module.get<ProductSpecialsService>(ProductSpecialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
