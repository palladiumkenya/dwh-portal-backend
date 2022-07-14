import { Test, TestingModule } from '@nestjs/testing';
import { OperationalHisController } from './care-treatment.controller';

describe('CareTreatment Controller', () => {
  let controller: OperationalHisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationalHisController],
    }).compile();

    controller = module.get<OperationalHisController>(OperationalHisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
