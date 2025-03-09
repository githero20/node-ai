import { OpenAI } from "openai";
// modular syntax

const openai = new OpenAI();

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "developer",
    content: "You are a helpful chatbot",
  },
];

async function createChatCompletion() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: context,
  });

  const responseMessage = response.choices[0].message;
  context.push({
    role: "assistant",
    content: responseMessage.content,
  });
  console.log(
    `${response.choices[0].message.role}: ${response.choices[0].message.content}`
  );
}

// used in Node.js to listen for input events on the standard input stream (stdin)
process.stdin.addListener("data", async function (input: any) {
  const userInput = input.toString().trim();
  context.push({
    role: "assistant",
    content: userInput,
  });
  await createChatCompletion();
});

// // used in Node.js to listen for input events on the standard input stream (stdin)
// process.stdin.addListener("data", async function (input: any) {
//   const userInput = input.toString().trim();

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       {
//         role: "developer",
//         content: "You are a helpful chatbot",
//       },
//       {
//         role: "user",
//         content: userInput,
//       },
//     ],
//   });
//   console.log(response.choices[0].message.content);
// });
