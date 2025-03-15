import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  CommaSeparatedListOutputParser,
  StringOutputParser,
  StructuredOutputParser,
} from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

async function stringParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description about this African country: {country_name}"
  );

  const parser = new StringOutputParser();

  // Creating a chain: connecting the model with the prompt
  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    country_name: "bicycle",
  });

  console.log(response);
}

async function commaSeparatedParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write the 5 oldest countries for: {continent}"
  );

  const parser = new CommaSeparatedListOutputParser();

  // Creating a chain: connecting the model with the prompt
  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    continent: "Europe",
  });

  console.log(response);
}

async function structuredParser() {
  const templatePrompt = ChatPromptTemplate.fromTemplate(`
  Extract information from the following phrase. 
  Formatting instructions: {format_instructions}
  Phrase: {phrase}
  `);

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    likes: "what the person likes",
  });

  const chain = templatePrompt.pipe(model).pipe(outputParser);

  const result = await chain.invoke({
    phrase: "John is likes Pineapple pizza",
    format_instructions: outputParser.getFormatInstructions(),
  });

  console.log(result);
}

structuredParser();
