import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";

import prepareHTMLContainer from "./utils/prepareHTMLContainer";
import scrapeData from "./utils/scraper";
import { aiSearchHandler } from "./controllers/aiSearchController";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  console.log(req.body);
  // const data = await prepareHTMLContainer(
  //   [
  //     "https://sports.tipico.de/de/alle/1101/42301",
  //     "https://sports.tipico.de/de/alle/1101/41301",
  //   ],
  //   ".SportsCompetitionsEvents-styles-module-competitions-events-block > .EventRow-styles-module-event-row"
  // );

  // const scheme = {
  //   //NOTE: alles ohne $() ist ein fester Wert
  //   bookie: "tipico",
  //   competition: { country: "GER", name: "Bundesliga" },
  //   game: {
  //     link: "$('.EventTeams-styles-team-title').eq(0).text();",
  //     date: "",
  //     team1: "$('.EventTeams-styles-module-team-title').eq(0).text();",
  //     team2: "$('.EventTeams-styles-module-team-title').eq(1).text();",
  //     odds: {
  //       team1: "",
  //       draw: "",
  //       team2: "",
  //     },
  //   },
  // };

  // const response = scrapeData(data, scheme);
  // res.send(response);
});

app.post("/ai-search", async (req, res) => {
  console.log(req.body);
  // aiSearchHandler("https://remix.run/docs/en/main/guides/envvars", "body");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
