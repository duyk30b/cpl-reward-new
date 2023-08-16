import { Test, TestingModule } from '@nestjs/testing';
import { ImportFileService } from './import-file.service';

describe('ImportFileService', () => {
  let service: ImportFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportFileService],
    }).compile();

    service = module.get<ImportFileService>(ImportFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
