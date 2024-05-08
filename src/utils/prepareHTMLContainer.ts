import { Page } from "puppeteer";
import startCluster from "./browserCluster";

/* TODO: if no selector is provided return the whole html */
const prepareHTMLContainer = async (
  url: string[],
  selector: string,
  title?: string
): Promise<string[]> => {
  try {
    const cluster = await startCluster();

    if (!cluster) throw new Error("Cluster could not be started");

    let pageData: string[] = [];

    //NOTE: Define here what the Browser instance should do
    await cluster.task(async ({ page, data: { url, selector } }) => {
      // Set User Agent
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
      );

      // Go to the URL, bring the page to the front, add jQuery and wait for the selector to load
      await page.goto(url, { waitUntil: "networkidle0" });
      await page.bringToFront();
      await page.addScriptTag({
        url: "https://code.jquery.com/jquery-3.3.1.slim.min.js",
      });
      await page.waitForSelector(selector, { timeout: 0 });
      // Scrape the data
      const container = await page.evaluate((sel) => {
        return Array.from($(sel), (e) => e.outerHTML);
      }, selector);
      // Store the scraped data in the pageData array
      pageData.push(...container);
    });

    url.forEach((url) => {
      cluster.queue({ url, selector });
    });

    await cluster.idle();
    console.log("Closing Cluster...");
    await cluster.close();

    return pageData;
  } catch (e) {
    return [""];
  }
};

export default prepareHTMLContainer;
