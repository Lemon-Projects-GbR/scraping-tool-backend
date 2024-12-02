import { Request, Response } from 'express';
import getContainerContent from '../utils/getContainerContent';
import { ContainerContent } from '../types/types';
import socialLinkService from '../services/socialLinksService';

const socialLinksController = async (req: Request, res: Response) => {
  const urls: string[] = req.body.urls;

  if (!urls) {
    res.status(400).send('Bad Request');
  }

  const containerContentList: ContainerContent[] = await getContainerContent(
    urls,
    'body',
  );

  const response = containerContentList.map(async container => {
    return await socialLinkService(container.url, container.data);
  });

  const resolvedResponses = await Promise.all(response);

  console.log('Data:', resolvedResponses);

  res.send(resolvedResponses);
};

export default socialLinksController;
