import { readFile, writeFile } from "fs/promises";
import { OpenAI } from "openai";
import { join } from "path";

export interface DataWithEmbeddings {
  input: string;
  embedding: number[];
}

const openai = new OpenAI();

export const generateEmbeddings = async (input: string | string[]) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
  });

  console.log(response.data[0].embedding);
  return response;
};

export async function loadJSONData<T>(fileName: string): Promise<T> {
  const path = join(__dirname, fileName);

  try {
    const rawData = await readFile(path, "utf-8"); // Specify encoding to get a string directly
    return JSON.parse(rawData) as T; // Cast to type T
  } catch (err) {
    console.error(`Error reading or parsing file: ${err}`);
    throw err; // Rethrow the error after logging it
  }
}

export async function saveDataFromJSONFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString);
  const path = join(__dirname, fileName);

  try {
    await writeFile(path, dataBuffer);
    console.log(`saved data to ${fileName}`);
  } catch (error) {
    console.error(`Error writing or parsing file: ${error}`);
  }
}

const main = async () => {
  const data = await loadJSONData<string[]>("data.json");
  const embeddings = await generateEmbeddings(data);
  const dataWithEmbeddings: DataWithEmbeddings[] = [];

  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddings.push({
      input: data[i],
      embedding: embeddings.data[i].embedding,
    });
  }

  await saveDataFromJSONFile(dataWithEmbeddings, "dataWithEmbeddings.json");
};

// generateEmbeddings(["Cat is on the roof.", "Dog is in the pool."]);
main();
