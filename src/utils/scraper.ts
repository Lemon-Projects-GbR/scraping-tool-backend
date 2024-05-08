import { load } from "cheerio";

const scrapeData = async (
  data: string[],
  scheme: Record<string, string | object>
) => {
  data.forEach((element) => {
    const $ = load(element);

    console.log($(".EventTeams-styles-module-team-title").eq(0).text());
    // for (const key in element) {
    //   if (obj.hasOwnProperty(key)) {
    //     const fullPath = path ? `${path}.${key}` : key;
    //     if (typeof obj[key] === "object" && obj[key] !== null) {
    //       // Recursive case for nested objects
    //       iterateNestedProperties(obj[key], fullPath);
    //     } else {
    //       // Base case for non-object properties
    //       console.log(
    //         `${fullPath}: ${obj[key].includes("$") ? eval(obj[key]) : obj[key]}`
    //       );
    //     }
    //   }
    // }
    // console.log(scheme);
  });
  const scrapedData: Record<string, string> = {};

  // iterateNestedProperties(scheme);

  return scrapedData;
};

const iterateNestedProperties = (obj: Record<any, any>, path = "") => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullPath = path ? `${path}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursive case for nested objects
        iterateNestedProperties(obj[key], fullPath);
      } else {
        // Base case for non-object properties
        console.log(
          `${fullPath}: ${obj[key].includes("$") ? eval(obj[key]) : obj[key]}`
        );
      }
    }
  }
};

export default scrapeData;
