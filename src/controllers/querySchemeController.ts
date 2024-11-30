import { Request, Response } from 'express';
import getContainerContent from '../utils/getContainerContent';
import querySchemeService from '../services/querySchemeService';

const querySchemeController = async (req: Request, res: Response) => {
  const reqBody: {
    urls: string[];
    baseContainer: string;
    scheme: Record<string, string | object>;
  } = req.body;

  if (!reqBody.urls || !reqBody.scheme) {
    res.status(400).send('Bad Request');
  }

  if (!reqBody.baseContainer) {
    reqBody.baseContainer = 'body';
  }

  console.log('Request Body:', reqBody);

  const data: string[] = await getContainerContent(
    reqBody.urls,
    reqBody.baseContainer,
  );

  console.log('Data:', data);

  const response: Record<string, string | object>[] = await querySchemeService(
    data,
    reqBody.scheme,
  );
  res.send(response);
};

export default querySchemeController;
