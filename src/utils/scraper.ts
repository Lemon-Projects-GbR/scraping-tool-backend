import { load } from 'cheerio';

async function scrapeData(
  data: string[],
  scheme: Record<string, string | object>,
) {
  const scrapedData: Record<string, string | object>[] = [];
  data.forEach(async element => {
    const evaluatedData = evaluateQueriesInScheme(scheme, element);
    if (Array.isArray(evaluatedData)) {
      scrapedData.push(...evaluatedData);
    } else {
      scrapedData.push(evaluatedData);
    }
  });
  return scrapedData;
}

function evaluateQueriesInScheme(
  obj: Record<string, any>, //any because the recursive object could be of any depth
  element: string,
): any {
  const $ = load(element);
  for (const [key, value] of Object.entries(obj)) {
    // If the value an object, recursively call the function to evaluate the nested object
    if (typeof obj[key] !== 'string') {
      evaluateQueriesInScheme(obj[key], element);
    } else {
      try {
        let results;
        if (obj[key].startsWith('$')) {
          results = $(eval(obj[key]));
        } else {
          results = $(obj[key]);
        }

        if (results.toArray().length > 1) {
          const resultsData: string[] = results.toArray().map(e => $(e).text());
          obj[key] = resultsData;
        } else {
          obj[key] = results.text();
        }
      } catch (e: any) {
        console.error('Error evaluating:', obj[key], e);
        const errorMsg = e.message ? e.message : 'Unknown Error';
        return { errorAttr: obj, errorMsg: errorMsg };
      }
    }
  }
  return obj;
}

export default scrapeData;
