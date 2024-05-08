import express from "express";
import "dotenv/config";
import prepareHTMLContainer from "./utils/prepareHTMLContainer";
import scrapeData from "./utils/scraper";

const app = express();

app.get("/", async (req, res) => {
  const data = await prepareHTMLContainer(
    [
      "https://sports.tipico.de/de/alle/1101/42301",
      "https://sports.tipico.de/de/alle/1101/41301",
    ],
    ".SportsCompetitionsEvents-styles-module-competitions-events-block > .EventRow-styles-module-event-row"
  );

  const scheme = {
    //NOTE: alles ohne $() ist ein fester Wert
    bookie: "tipico",
    competition: { country: "GER", name: "Bundesliga" },
    game: {
      link: "$(item).find('.EventTeams-styles-team-title').eq(0).text();",
      date: "",
      team1: "",
      team2: "",
      odds: {
        team1: "$(item).find('.EventTeams-styles-team-title').eq(0).text();",
        draw: "$(item).find('.EventTeams-styles-team-title').eq(1).text();",
        team2: "$(item).find('.EventTeams-styles-team-title').eq(2).text();",
      },
    },
  };

  const response = scrapeData(data, scheme);
  res.send(response);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
