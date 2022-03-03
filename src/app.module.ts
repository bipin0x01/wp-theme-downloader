import { Module } from '@nestjs/common';
import { ThemeDownloaderModule } from './theme-downloader/theme-downloader.module';

@Module({
  imports: [ThemeDownloaderModule],
})
export class AppModule {}
