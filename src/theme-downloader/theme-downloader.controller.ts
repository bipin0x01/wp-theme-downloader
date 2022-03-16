import { Controller, Post, Body, Get, Render, Header } from '@nestjs/common';
import { ThemeDownloaderService } from './theme-downloader.service';

// types
import { td } from './theme-downloader.dto';

@Controller()
export class ThemeDownloaderController {
  constructor(private ThemeDownload: ThemeDownloaderService) {}

  @Post('/theme')
  public async download(@Body() td: td) {
    const siteLink = td.link;
    return this.ThemeDownload.themeLinkGenerator(siteLink);
  }
}
