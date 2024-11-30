// import { Page } from 'puppeteer';
import startCluster from './browserCluster';

/* TODO: if no selector is provided return the whole html */
/**
 * This function scrapes the content of a container from a list of URLs. The container is defined by a selector.
 * @param urls - List of URLs to scrape
 * @param containerSelector - Selector for the container to scrape. Can be a jQuery or vanilla JS selector
 */
async function getContainerContent(
  urls: string[],
  containerSelector: string,
): Promise<string[]> {
  try {
    const cluster = await startCluster();

    if (!cluster) throw new Error('Cluster could not be started');

    let pageData: string[] = [];

    //NOTE: Define here what the Browser instance should do
    await cluster.task(async ({ page, data: { url, containerSelector } }) => {
      // Set User Agent
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
      );

      // Go to the URL, bring the page to the front, add jQuery and wait for the selector to load
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.bringToFront();
      await page.addScriptTag({
        url: 'https://code.jquery.com/jquery-3.3.1.slim.min.js',
      });
      await page.waitForFunction(`!!${containerSelector}`, { timeout: 0 });
      // Scrape the data
      const container = await page.evaluate(sel => {
        try {
          // jquery selector
          if (sel.startsWith('$')) {
            return $(eval(sel))
              .map((_, e) => e.outerHTML)
              .get();
          } else {
            // vanilla js selector
            return Array.from($(sel), e => e.outerHTML);
          }
        } catch (e) {
          console.error('Error evaluating', sel, e);
          return [''];
        }
      }, containerSelector);
      // Store the scraped data in the pageData array
      pageData.push(...container);

      await page.close();
    });

    urls.forEach(url => {
      cluster.queue({ url, containerSelector });
    });

    await cluster.idle();
    console.log('Closing Cluster...');
    await cluster.close();

    return pageData;
  } catch (e) {
    return [''];
  }
}

export default getContainerContent;
