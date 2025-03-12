import OpenAI from "openai";
import { createReadStream, writeFile } from "fs";

const openai = new OpenAI();

async function createTranscription() {
  const response = await openai.audio.transcriptions.create({
    file: createReadStream("AudioSample.m4a"),
    model: "whisper-1",
    language: "en",
  });
  console.log(response);
}

async function translate() {
  const response = await openai.audio.translations.create({
    file: createReadStream("FrenchSample.m4a"),
    model: "whisper-1",
  });
  console.log(response);
}

async function textToSpeech() {
  const sampleText =
    "Nigeria is a country of different extremes. Religious, financial and societal to name a few. It is located in Western Africa and is known for its beautiful farmlands and industrious people.";

  const response = await openai.audio.speech.create({
    input: sampleText,
    voice: "onyx",
    model: "tts-1",
    response_format: "mp3",
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile("Nigeria.mp3", buffer, (err) => {
    err
      ? console.log("An error occurred")
      : console.log("File created successfully!");
  });
}

createTranscription();
translate();
textToSpeech();
