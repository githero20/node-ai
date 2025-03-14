import { ChatOpenAI } from "@langchain/openai";

// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.8,
  maxTokens: 700,
  verbose: true,
});

const main = async () => {
  // const response1 = await model.invoke(
  //   "Who are the youngest African presidents?"
  // );
  // console.log(response1);

  // // batches all responses and returns
  // const response2 = await model.batch([
  //   "What is your name?",
  //   "Who are the youngest African presidents?",
  // ]);
  // console.log(response2);

  // returns in chunks
  const response3 = await model.stream(
    "Who are the youngest African presidents?"
  );
  for await (const chunk of response3) {
    console.log(chunk.content);
  }
};
