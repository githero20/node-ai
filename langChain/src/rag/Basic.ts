import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
});

const myData = [
  "My name is John.",
  "My name is Bob.",
  "My favorite food is pizza.",
  "My favorite food is pasta.",
];

const question = "What are my favorite foods?";

async function main() {
  // store the data
  // pass the embedding from OpenAI
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  // it only works with documents, so we have to create langChain docs for
  // every entry in the array
  await vectorStore.addDocuments(
    myData.map((content) => new Document({ pageContent: content }))
  );

  // create data retriever:
  const retriever = vectorStore.asRetriever({
    k: 2, // no of elements to be returned by the retriever i.e. will return 2 most similar elements
  });

  // get relevant documents:
  const results = await retriever.invoke(question);
  const resultDocs = results.map((result) => result.pageContent);

  //build template:
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the users question based on the following context: {context}",
    ],
    ["user", "{input}"],
  ]);

  const chain = template.pipe(model);

  const response = await chain.invoke({
    input: question,
    context: resultDocs,
  });

  console.log(response.content);
}

main();
