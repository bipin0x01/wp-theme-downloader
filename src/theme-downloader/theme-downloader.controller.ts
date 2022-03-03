import { Controller, Post, Body, Get } from '@nestjs/common';
import { ThemeDownloaderService } from './theme-downloader.service';

// types
import { td } from './theme-downloader.dto';
// axios for http requests
import axios from 'axios';

// cheerio for html parsing
import cheerio from 'cheerio';

@Controller()
export class ThemeDownloaderController {
  constructor(private Td: ThemeDownloaderService) {}

  @Post('/download')
  public async download(@Body() td: td) {
    const siteLink = td.link;
    try {
      const site = await axios.get(siteLink);
      const $ = cheerio.load(site.data);
      const html = $.root().html();
      return html;
    } catch (error) {
      return error;
    }
  }
}
