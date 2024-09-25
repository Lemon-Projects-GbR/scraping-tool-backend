import prepareHTMLContainer from "../utils/prepareHTMLContainer";

const getDocument = async (
  url: string,
  baseContainer: string
): Promise<string[]> => {
  const doc = await prepareHTMLContainer([url], baseContainer || "body");
  return doc;
};

const cleanDocument = (doc: string) => {
  const cleanedDoc = doc;
  return doc;
};

const promptDocumentForData = async (doc: string, prompt: string) => {};

export const aiSearchHandler = async (url: string, baseContainer: string) => {
  const doc = await getDocument(url, baseContainer);
  const cleanedDoc = cleanDocument(doc[0]);
  promptDocumentForData(
    cleanedDoc,
    "What do you want to do with this document?"
  );
};
