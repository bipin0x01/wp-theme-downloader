import { Controller, Post, Body, Get, Render, Header, HttpCode } from '@nestjs/common';
import { ThemeDownloaderService } from './theme-downloader.service';

// types
import { td } from './theme-downloader.dto';

@Controller()
export class ThemeDownloaderController {
  constructor(private ThemeDownload: ThemeDownloaderService) {}

  @Post('/theme/download')
  @HttpCode(200)
  public async theme(@Body() td: td) {
    const siteLink = td.link;
    return this.ThemeDownload.themeLinkGenerator(siteLink);
  }

  @Post('/theme/info')
  @HttpCode(200)
  public async themeInfo(@Body() td: td) {
    const siteLink = td.link;
    return this.ThemeDownload.themeInfo(siteLink);
  }

  @Post('/plugins')
  @HttpCode(200)
  public async plugins(@Body() td: td) {
    const siteLink = td.link;
    const getPlugins = await this.ThemeDownload.pluginsDetector(siteLink);
    if (getPlugins.status === 'success') {
      const allPlugins = getPlugins?.plugins;
      const pluginDetails = this.ThemeDownload.pluginDetails(allPlugins);
      return pluginDetails;
    }
  }
}
