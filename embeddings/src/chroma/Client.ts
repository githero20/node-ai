import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

const chromaClient = new ChromaClient({ path: "http://localhost:8000" });
chromaClient.heartbeat();

// async function main() {
//   const res = await chromaClient.createCollection({
//     name: "data-ai",
//   });

//   console.log(res);
// }

const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY,
  openai_model: "text-embedding-3-small",
});

const addData = async () => {
  const collection = await chromaClient.getCollection({
    name: "data-ai",
    embeddingFunction,
  });

  const result = await collection.add({
    ids: ["id0"],
    documents: ["New entry"],
    // embeddings: [[0.1, 0.2]],
  });

  console.log(result);
};

async function testConnection() {
  try {
    const collections = await chromaClient.listCollections();
    console.log("Collections:", collections);
  } catch (error) {
    console.error("Error connecting to ChromaDB:", error);
  }
}

// Collection {
//   name: 'data-ai',
//   id: 'e29d815d-5607-4777-9aaf-a3a09d38737b',
//   metadata: null,
//   client: ChromaClient {
//     tenant: 'default_tenant',
//     database: 'default_database',
//     authProvider: undefined,
//     api: ApiApi {
//       basePath: 'http://localhost:8000',
//       fetch: [AsyncFunction: chromaFetch],
//       configuration: [Configuration],
//       options: {}
//     },
//     _adminClient: AdminClient {
//       tenant: 'default_tenant',
//       database: 'default_database',
//       authProvider: undefined,
//       api: [ApiApi]
//     },
//     _initPromise: Promise { undefined }
//   },
//   embeddingFunction: _DefaultEmbeddingFunction {
//     name: 'default',
//     model: 'Xenova/all-MiniLM-L6-v2',
//     revision: 'main',
//     quantized: false,
//     progress_callback: null
//   }
// }

// main();
testConnection();
addData();
