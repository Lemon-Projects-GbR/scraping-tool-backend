import { Request, Response } from 'express';
import getContainerContent from '../utils/getContainerContent';
import querySchemeService from '../services/querySchemeService';
import { ContainerContent } from '../types/types';

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

  const containerContentList: ContainerContent[] = await getContainerContent(
    reqBody.urls,
    reqBody.baseContainer,
  );

  const response = containerContentList.map(async container => {
    return await querySchemeService(container.data, reqBody.scheme);
  });

  const resolvedResponses = await Promise.all(response);

  console.log('Data:', resolvedResponses);

  res.send(resolvedResponses);
};

export default querySchemeController;
