import { Injectable } from '@nestjs/common';
import axios from 'axios';
// cheerio for html parsing
import cheerio from 'cheerio';

@Injectable()
export class ThemeDownloaderService {
  //   public download(link: string): string {
  //     return link;
  //   }

  // Get all the links from the given url
  private async getLinksFromSite(url: string) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let links = [];
    $('link').each((i, link) => {
      links.push($(link).attr('href'));
    });
    return links;
  }

  // Generate theme download link for the given website url
  private async themeGenerator(siteLink: string, links: string[]) {
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

      const checkTheme = await axios.get(themeUrl);
      return checkTheme.status === 200
        ? {
            status: 'success',
            message: 'Theme found!',
            url: themeUrl.toString(),
          }
        : {
            status: 'error',
            message:
              "Theme not found! Seems like There's nothing left for you.",
            url: null,
          };
    }

    if (!wpSiteValidator) {
      //   if it doesn't, return the error message
      return {
        status: 'error',
        message: 'It is not an wordpress website',
        url: null,
      };
    }
  }

  public async themeLinkGenerator(siteLink: string) {
    try {
      const links = await this.getLinksFromSite(siteLink);

      const theme = await this.themeGenerator(siteLink, links);

      return theme;
    } catch (error) {
      return {
        status: 'error',
        message:
          'Something went wrong! Please check the website url and try again.',
        url: null,
      };
    }
  }

  public async pluginsDetector(siteLink: string) {
    try {
      const links = await this.getLinksFromSite(siteLink);

      const plugins = links.filter((link) =>
        link.includes('/wp-content/plugins/'),
      );

      // strip the plugins name from the plugins array and return the array
      const pluginsName = plugins.map((plugin) => {
        const pluginName = plugin.split('/');
        const pluginIndex = pluginName.indexOf('plugins');
        return pluginName[pluginIndex + 1];
      });
      // delete duplicate elements from the plugins array
      const pluginsList = [...new Set(pluginsName)];

      return {
        status: 'success',
        message:
          'Success! We found some plugins for you. Please check the plugins list.',
        plugins: pluginsList,
      };
    } catch (error) {
      return {
        status: 'error',
        message:
          'Something went wrong! Please check the website url and try again.',
        plugins: null,
      };
    }
  }

  public async pluginDetails(pluginsList: string[]) {
    try {
      const plugins = pluginsList.map(async (plugin) => {
        const pluginUrl = `https://wordpress.org/plugins/${plugin}/`;
        const pluginResponse = await axios.get(pluginUrl);
        const $ = cheerio.load(pluginResponse.data);
        const pluginDetails = {
          name: plugin,
          description: $('.plugin-description').text().split('.')[0] + '.',
          downloadLink: $('.plugin-download').attr('href'),
        };
        return pluginDetails;
      });
      const allPluginsDetails = await Promise.all(plugins);
      return allPluginsDetails;
    } catch (error) {
      return error;
    }
  }
}
