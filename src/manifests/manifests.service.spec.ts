import { Test, TestingModule } from '@nestjs/testing';
import { ManifestsService } from './manifests.service';

describe('ManifestsService', () => {
  let service: ManifestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManifestsService],
    }).compile();

    service = module.get<ManifestsService>(ManifestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
