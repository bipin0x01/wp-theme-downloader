import { Module } from '@nestjs/common';
import { ThemeDownloaderController } from './theme-downloader.controller';
import { ThemeDownloaderService } from './theme-downloader.service';

@Module({
  controllers: [ThemeDownloaderController],
  providers: [ThemeDownloaderService],
})
export class ThemeDownloaderModule {}
