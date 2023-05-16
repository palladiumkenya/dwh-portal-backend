import { Test, TestingModule } from '@nestjs/testing';
import { PmtctRRIController } from './pmtct-rri.controller';

describe('PMTCT RRI', () => {
  let controller: PmtctRRIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [PmtctRRIController],
    }).compile();

    controller = module.get<PmtctRRIController>(PmtctRRIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
