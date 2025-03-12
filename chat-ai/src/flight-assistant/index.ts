import OpenAI from "openai";

const openAI = new OpenAI();

const getFlightsBtwnAirports = (origin: string, destination: string) => {
  return `There are 3 flights between ${origin} and ${destination} : 1234, 5678 and 0123`;
};

const makeFlightReservation = (flightNo: string) => {
  return `Here is your reservation for flight ${flightNo}: 34560`;
};

const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: "developer",
    content:
      "You are a helpful assistant that gives info about available flights between two airports and reserves them.",
  },
];

async function callOpenAIWithTools() {
  const response = await openAI.chat.completions.create({
    model: "chatgpt-4o-mini",
    messages: context,
    tools: [
      {
        type: "function",
        function: {
          name: "getFlightsBtwnAirports",
          description: "Returns the list of flights between two airports",
          parameters: {
            type: "object",
            properties: {
              origin: {
                type: "string",
                description: "The origin airport of the trip",
              },
              destination: {
                type: "string",
                description: "The destination airport of the trip",
              },
            },
            required: ["origin", "destination"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "makeFlightReservation",
          description: "Returns the reservation number",
          parameters: {
            type: "object",
            properties: {
              flightNo: {
                type: "string",
                description: "The flight reservation number:",
              },
            },
            required: ["flightNo"],
          },
        },
      },
    ],
    tool_choice: "auto", // the engine will decide which tool to use
  });

  // decide if tool call is required based on the response
  const willInvokeFunction: boolean =
    response.choices[0].finish_reason === "tool_calls";
  const toolCall = response.choices[0].message.tool_calls![0];

  if (willInvokeFunction) {
    const toolName = toolCall.function.name;

    if (toolName === "getFlightsBtwnAirports") {
      const rawArguments = toolCall.function.arguments;
      const parsedArguments = JSON.parse(rawArguments);
      const toolResponse = getFlightsBtwnAirports(
        parsedArguments.origin,
        parsedArguments.destination
      );
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: toolCall.id,
      });
    }

    if (toolName === "makeFlightReservation") {
      const rawArguments = toolCall.function.arguments;
      const parsedArguments = JSON.parse(rawArguments);
      const toolResponse = makeFlightReservation(parsedArguments.flightNo);
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: toolCall.id,
      });
    }
  }

  const secondResponse = await openAI.chat.completions.create({
    model: "chatgpt-4o-mini",
    messages: context,
  });

  console.log(secondResponse.choices[0].message.content);
}

console.log("Hello from the flight assistant chatbot!");
// used in Node.js to listen for input events on the standard input stream (stdin)
process.stdin.addListener("data", async function (input: any) {
  const userInput = input.toString().trim();
  context.push({
    role: "assistant",
    content: userInput,
  });
  await callOpenAIWithTools();
});
