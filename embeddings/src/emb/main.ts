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

// enum Position {
//   Developer,
//   HR,
//   Manager,
//   CEO,
// }

enum Position {
  Developer = "Developer",
  HR = "HR",
  Manager = "Manager",
  /**
   * Must receive at least 2000% yearly bonus
   * these comments can only be added to enums, objects not the Postion Type
   */
  CEO = "CEO",
}

type PositionType = "Developer" | "HR" | "Manager" | "CEO";

type Employee = {
  name: string;
  salary: number;
  /**
   * Position must be an enum
   */
  position: Position;
};

function payPS(employee: Employee) {
  let bonusPercent: number = 0;
  const position = employee.position;

  switch (position) {
    case Position.Developer:
      bonusPercent = 0.2;
      break;
    case Position.HR:
      bonusPercent = 0.8;
      break;
    case Position.Manager:
      bonusPercent = 1;
      break;
    case Position.CEO:
      bonusPercent = 20;
      break;

    default:
      // will throw an error if we haven't exhausted all Positions because of the 'never' type
      // means if any more Positions exist or any of the remaining values is not type 'never'
      // then it will throw an error
      const remainingValues: never = position;
      console.log(remainingValues);
      break;
  }
}

// docker pull chromadb/chroma
// docker run -p 8000:8000 chromadb/chroma
// http://localhost:8000/api/v1
