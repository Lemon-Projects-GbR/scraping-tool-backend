import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';

import querySchemaController from './controllers/querySchemeController';
import socialLinksController from './controllers/socialLinksController';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

app.post('/query', async (req, res) => {
  await querySchemaController(req, res);
});

app.post('/social-links', async (req, res) => {
  await socialLinksController(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
