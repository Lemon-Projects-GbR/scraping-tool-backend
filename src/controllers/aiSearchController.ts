/* import { load } from 'cheerio';
import ollama from 'ollama';
import { get_encoding, encoding_for_model } from 'tiktoken';

import prepareHTMLContainer from '../utils/getContainerContent';

const getDocument = async (
  url: string,
  baseContainer: string,
): Promise<string[]> => {
  const doc = await prepareHTMLContainer([url], baseContainer || 'body');
  return doc;
};

const cleanDocument = (doc: string): string => {
  const $ = load(doc);
  $('script').remove();
  $('style').remove();
  $('meta').remove();
  $('link').remove();
  $('noscript').remove();
  $('header').remove();
  $('footer').remove();
  $('nav').remove();
  $('aside').remove();
  $('iframe').remove();
  $('object').remove();
  $('embed').remove();
  $('param').remove();
  $('svg').remove();
  $('comment').remove();
  return $.html();
};

const promptDocumentForData = async (doc: string, prompt: string) => {
  const response = await ollama.chat({
    model: 'llama3.1',
    messages: [{ role: 'user', content: 'Why is the sky blue?' }],
  });
  console.log(response.message.content);
};

export const aiSearchHandler = async (
  url: string,
  baseContainer: string,
  prompt: string,
) => {
  const doc = await getDocument(url, baseContainer);
  const cleanedDoc = cleanDocument(doc[0]);
  promptDocumentForData(cleanedDoc, 'Get the name of all products on the page');
  return cleanedDoc;
};
 */
