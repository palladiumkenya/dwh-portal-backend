import { Test, TestingModule } from '@nestjs/testing';
import { ManifestsController } from './manifests.controller';

describe('Manifests Controller', () => {
  let controller: ManifestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManifestsController],
    }).compile();

    controller = module.get<ManifestsController>(ManifestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
