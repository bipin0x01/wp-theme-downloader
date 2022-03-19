import { Test, TestingModule } from '@nestjs/testing';
import { ThemeDownloaderController } from './theme-downloader.controller';

describe('ThemeDownloaderController', () => {
  let controller: ThemeDownloaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemeDownloaderController],
    }).compile();

    controller = module.get<ThemeDownloaderController>(
      ThemeDownloaderController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
