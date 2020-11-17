import { Test, TestingModule } from '@nestjs/testing';
import { CareTreatmentController } from './care-treatment.controller';

describe('CareTreatment Controller', () => {
  let controller: CareTreatmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareTreatmentController],
    }).compile();

    controller = module.get<CareTreatmentController>(CareTreatmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
