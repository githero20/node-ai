import { OpenAI } from "openai";
import { encoding_for_model } from "tiktoken";

const openai = new OpenAI();
const encoder = encoding_for_model("gpt-4o-mini");

const MAX_TOKENS = 500;

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "developer",
    content: "You are a helpful chatbot",
  },
];

async function createChatCompletion() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context,
  });

  const responseMessage = response.choices[0].message;
  context.push({
    role: "assistant",
    content: responseMessage.content,
  });

  if (response.usage && response.usage.total_tokens > MAX_TOKENS) {
    deleteOlderMessages();
  }

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

function getContextLength() {
  let length = 0;
  context.forEach((message) => {
    if (typeof message.content == "string") {
      length += encoder.encode(message.content).length;
    } else if (Array.isArray(message.content)) {
      message.content.forEach((messageContent) => {
        if (messageContent.type == "text") {
          length += encoder.encode(messageContent.text).length;
        }
      });
    }
  });
  return length;
}

function deleteOlderMessages() {
  let contextLength = getContextLength();

  while (contextLength > MAX_TOKENS) {
    for (let i = 0; i < context.length; i++) {
      const message = context[i];
      if (message.role != "developer") {
        context.splice(i, 1);
        contextLength = getContextLength();
        console.log("New context length: " + contextLength);
        break;
      }
    }
  }
}
