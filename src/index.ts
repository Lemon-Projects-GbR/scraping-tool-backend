import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';

import prepareHTMLContainer from './utils/prepareHTMLContainer';
import scrapeData from './utils/scraper';
import { aiSearchHandler } from './controllers/aiSearchController';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const reqBody: {
    urls: string[];
    baseContainer: string;
    scheme: Record<string, string | object>;
  } = req.body;

  const data: string[] = await prepareHTMLContainer(
    reqBody.urls,
    reqBody.baseContainer,
  );

  const response: Record<string, string | object>[] = await scrapeData(
    data,
    reqBody.scheme,
  );
  res.send(response);
});

app.post('/ai-search', async (req, res) => {
  const aiSearchResults = await aiSearchHandler(
    req.body.url,
    'body',
    req.body.prompt,
  );
  res.send(aiSearchResults);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
