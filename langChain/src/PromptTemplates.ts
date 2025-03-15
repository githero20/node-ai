import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

// creating a chain from a template
async function fromTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description about this African country: {country_name}"
  );

  const wholePrompt = await prompt.format({
    country_name: "Benin",
  });

  // Creating a chain: connecting the model with the prompt
  const chain = prompt.pipe(model);

  const response = await chain.invoke({
    country_name: "bicycle",
  });

  console.log(response.content);
}

// creating a chain from a message
async function fromMessage() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Write a short description about this African country"],
    ["human", "{country_name}"],
  ]);

  const chain = prompt.pipe(model);

  const result = await chain.invoke({
    country_name: "Senegal",
  });

  console.log(result.content);
}
