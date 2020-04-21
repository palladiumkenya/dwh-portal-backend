import { Test, TestingModule } from '@nestjs/testing';
import { ReportingRatesController } from './reporting-rates.controller';

describe('ReportingRates Controller', () => {
  let controller: ReportingRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportingRatesController],
    }).compile();

    controller = module.get<ReportingRatesController>(ReportingRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
