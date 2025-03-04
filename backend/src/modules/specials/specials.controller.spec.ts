import { Test, TestingModule } from '@nestjs/testing';
import { SpecialsController } from './specials.controller';
import { SpecialsService } from './specials.service';

describe('SpecialsController', () => {
  let controller: SpecialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialsController],
      providers: [SpecialsService],
    }).compile();

    controller = module.get<SpecialsController>(SpecialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
