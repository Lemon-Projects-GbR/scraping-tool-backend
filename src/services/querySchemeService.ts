import { Cheerio, load } from 'cheerio';

/**
 * This function evaluates the query scheme and returns the scraped data in the JSON format specified in the scheme.
 * @param data - The data to scrape
 * @param scheme - The query scheme to evaluate. It contains the Scheme (JSON format) and the selectors to scrape the data.
 * @returns The scraped data in the JSON format specified in the scheme.
 */
async function querySchemeService(
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

// NOTE: I used to know how this function works. Oh well.
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
        let results: Cheerio<any>;
        if (obj[key].startsWith('$')) {
          // regex to match jQuery-style chained methods
          const match = obj[key].match(/\$\((['"].+?['"])\)((\.\w+\(.*?\))*)/);

          if (!match) {
            throw new Error('Invalid jQuery selector');
          } else {
            const selector = match[1].slice(1, -1); // selector for the element
            const methodChain = match[2]; // method chain (if any)

            results = $(selector); // Select the element

            const methodCalls = methodChain.match(/\.\w+\(.*?\)/g); // Match each method call
            if (methodCalls) {
              for (const call of methodCalls) {
                const methodMatch = call.match(/\.(\w+)\((.*?)\)/);

                if (methodMatch) {
                  const method = methodMatch[1];
                  const arg = methodMatch[2]
                    ? methodMatch[2].replace(/['"]/g, '')
                    : null;

                  // Ensure the method exists and is a function
                  if (
                    typeof results[method as keyof typeof results] ===
                    'function'
                  ) {
                    const methodFunction = results[
                      method as keyof typeof results
                    ] as unknown as Function;
                    results = arg
                      ? methodFunction.call(results, arg)
                      : methodFunction.call(results);
                  } else {
                    throw new Error(`Unsupported method: ${method}`);
                  }
                }

                obj[key] =
                  results instanceof Object && 'toArray' in results
                    ? results.toArray().map(e => $(e).text()) // Array of elements
                    : results; // Single result
              }
            }
          }
        } else {
          results = $(obj[key]);
        }

        if (results && typeof results === 'object' && 'toArray' in results) {
          obj[key] = results.toArray().map(e => $(e).text());
        } else {
          obj[key] = results;
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

export default querySchemeService;
