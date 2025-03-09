import { OpenAI } from "openai";
import { encoding_for_model } from "tiktoken";
// modular syntax

const openai = new OpenAI();

const main = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    // store: true,
    messages: [
      {
        role: "developer",
        content: `You are a helpful assistant that answers programming questions in the style of a benin man from the south south of Nigeria. And you respond in JSON format, like this:
                coolness level: 1-10,
                answer: your answer`,
      },
      {
        role: "user",
        content: "tell me about Tianmen square",
      },
    ],
    // n: 2,
    // frequency_penalty: 1.5,
  });
  console.log(response.choices[0].message.content);
};

// encodes the prompt to tokens
const encodePrompt = () => {
  const prompt = "How are you today?";
  const encoder = encoding_for_model("gpt-4o");
  const words = encoder.encode(prompt);
  console.log(words);
};

main();
encodePrompt();
