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
      let links = [];
      $('link').each((i, link) => {
        links.push($(link).attr('href'));
      });

      //   strip the input url of the domain name and only get the name
      const name = siteLink.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');

      // regex pattern to match the style.css file
      const regex = new RegExp(
        `${name}\/wp-content\/([a-zA-Z]+(\/[a-zA-Z]+)+)\/style.css`,
        'g',
      );

      //   check if the styles file exists in the links array
      const styleFile = links.find((link) => regex.test(link));
      if (styleFile) {
        //   if the regex file exists, return the element that matches the regex
        const themePath = styleFile.split('/');
        const themeName = themePath[themePath.length - 2] + '.zip';
        const themeUrl = `${siteLink}/wp-content/themes/${themeName}`;

        const checkTheme = await axios.get(themeUrl);
        if (checkTheme.status !== 404) {
          return themeUrl;
        } else {
          return "Theme not found! Seems like There's nothing left for you.";
        }
      } else {
        //   if it doesn't, return the error message
        return 'It is not an wordpress website';
      }
    } catch (error) {
      return error;
    }
  }
}
