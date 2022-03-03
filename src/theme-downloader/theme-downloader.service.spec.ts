import { Test, TestingModule } from '@nestjs/testing';
import { ThemeDownloaderService } from './theme-downloader.service';

describe('ThemeDownloaderService', () => {
  let service: ThemeDownloaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThemeDownloaderService],
    }).compile();

    service = module.get<ThemeDownloaderService>(ThemeDownloaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
