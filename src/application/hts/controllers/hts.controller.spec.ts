import { Test, TestingModule } from '@nestjs/testing';
import { HtsController } from './hts.controller';

describe('Hts Controller', () => {
  let controller: HtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HtsController],
    }).compile();

    controller = module.get<HtsController>(HtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
