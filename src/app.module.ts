import { Module } from '@nestjs/common';
import { ThemeDownloaderModule } from './theme-downloader/theme-downloader.module';
import { ThemeDownloaderService } from './theme-downloader/theme-downloader.service';

@Module({
  imports: [ThemeDownloaderModule],
  providers: [ThemeDownloaderService],
})
export class AppModule {}
