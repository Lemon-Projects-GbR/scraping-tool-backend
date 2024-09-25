import { load } from "cheerio";

const scrapeData = async (
  data: string[],
  scheme: Record<string, string | object>
) => {
  const scrapedData: any[] = [];
  data.forEach(async (element) => {
    // console.log(eval('$(".EventTeams-styles-module-team-title").eq(0).text()'));

    const evaluatedData = await evaluateDollarExpressions(scheme, element);
    console.log(evaluatedData);
    scrapedData.push(evaluatedData);
    // console.log(evaluateDollarExpressions(scheme));
  });

  // iterateNestedProperties(scheme);
  // console.log(scrapedData);
  return scrapedData;
};

function evaluateDollarExpressions(
  obj: Record<any, any> | string,
  element: string
) {
  // If it's an object, we recursively handle each key-value pair
  const $ = load(element);
  // console.log(eval('$(".EventTeams-styles-module-team-title").eq(0).text()'));
  if (typeof obj === "object" && obj !== null) {
    // const result: Record<any, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      // console.log("before:", obj[key]);
      obj[key] = evaluateDollarExpressions(value, element);
      // console.log("after:", obj[key]);
    }
    return obj;
  }
  // If it's a string starting with a `$`, evaluate it using eval
  if (typeof obj === "string" && obj.startsWith("$")) {
    try {
      return eval(obj);
    } catch (e) {
      console.error("Error evaluating:", obj, e);
      return null;
    }
  }
  // Return the value as is if it's not something to evaluate
  return obj;
}

export default scrapeData;
