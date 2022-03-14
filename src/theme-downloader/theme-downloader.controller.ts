import { Controller, Post, Body, Get, Render, Header } from '@nestjs/common';
import { ThemeDownloaderService } from './theme-downloader.service';

// types
import { td } from './theme-downloader.dto';
// axios for http requests
import axios from 'axios';

// cheerio for html parsing
import cheerio from 'cheerio';

async function getLinksFromSite(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  let links = [];
  $('link').each((i, link) => {
    links.push($(link).attr('href'));
  });
  return links;
}

@Controller()
export class ThemeDownloaderController {
  constructor(private Td: ThemeDownloaderService) {}

  @Post('/theme')
  public async download(@Body() td: td) {
    const siteLink = td.link;
    try {
      const links = await getLinksFromSite(siteLink);

      //   strip the input url of the domain name and only get the name
      const name = siteLink.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');

      // regex pattern to match the style.css file
      const wpSite = new RegExp(
        `${name}\/wp-content\/([a-zA-Z]+(\/[a-zA-Z]+)+)`,
        'g',
      );

      // regex pattern to match the wp-includes path
      const themeLink = new RegExp(`${name}\/wp-content\/themes`, 'g');

      //   check if the styles file exists in the links array
      const theme = links.find((link) => themeLink.test(link));

      //  check if the site uses wordpress or not
      const wpSiteValidator = links.find((link) => wpSite.test(link));

      if (wpSiteValidator) {
        //   if the regex file exists, return the element that matches the regex
        const themePath = theme.split('/');

        const themesIndex = themePath.indexOf('themes');

        const themeName = themePath[themesIndex + 1] + '.zip';
        const themeUrl = `${siteLink}/wp-content/themes/${themeName}`;
        return themeUrl;
        // const checkTheme = await axios.get(themeUrl);
        // checkTheme.status !== 404
        //   ? {
        //       status: 'success',
        //       message: 'download link found!',
        //       url: themeUrl.toString(),
        //     }
        //   : {
        //       status: 'error',
        //       message:
        //         "Theme not found! Seems like There's nothing left for you.",
        //       url: null,
        //     };
      }

      if (!wpSiteValidator) {
        //   if it doesn't, return the error message
        return {
          message: 'It is not an wordpress website',
          downloadLink: null,
        };
      }
    } catch (error) {
      return error;
    }
  }

  @Get('/')
  public async index() {
    return {
      message: 'Welcome to the theme downloader',
    };
  }
}
