import { HfInference } from "@huggingface/inference";
import { writeFile } from "fs";

const inference = new HfInference(process.env.HF_TOKEN);

// Hugging face calls the generation of embeddings, feature extraction

// the call is always longer the first time because it is calling the model
async function embed() {
  const output = await inference.featureExtraction({
    inputs: "My cool embeddings",
    model: "deepseek-ai/DeepSeek-R1",
  });
  console.log(output);
}

async function translate() {
  const result = await inference.translation({
    model: "t5-base",
    inputs: "How is the weather in Paris?",
  });
  console.log(result);
}

async function translate2() {
  const result = await inference.translation({
    model: "facebook/mbart-large-50-many-to-many-mmt",
    inputs: "How is the weather in Paris?",
    parameters: {
      src_lang: "en_XX",
      tgt_lang: "fr_XX",
    },
  });
  console.log(result);
}

async function answerQuestion() {
  const result = await inference.questionAnswering({
    inputs: {
      context: "The quick brown fox jumps over the lazy dog.",
      question: "What is the fox's adjective?",
      // the model used only answers the question based on the context
    },
  });
  console.log(result);
}

async function textToImage() {
  const result = await inference.textToImage({
    inputs: "Cat in the hat on a mat",
    model: "stabilityai/stable-diffusion-2",
    parameters: {
      negative_prompt: "blurry",
    },
  });

  const buffer = Buffer.from(await result.arrayBuffer());
  writeFile("image.png", buffer, () => {
    console.log("image saved");
  });
}

answerQuestion();
