import { Test, TestingModule } from '@nestjs/testing';
import { ReportingRatesService } from './reporting-rates.service';

describe('ReportingRatesService', () => {
  let service: ReportingRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportingRatesService],
    }).compile();

    service = module.get<ReportingRatesService>(ReportingRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
