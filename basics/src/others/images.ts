import OpenAI from "openai";
import { writeFileSync, writeFile, createReadStream } from "fs";

const openai = new OpenAI();

async function generateFreeImage() {
  const response = await openai.images.generate({
    prompt: "A photo of a cat on a mat",
    model: "dall-e-2",
    style: "vivid",
    size: "256x256",
    quality: "standard",
    n: 1,
  });
  console.log(response);
}

async function generateFreeLocalImage() {
  const response = await openai.images.generate({
    prompt: "A photo of a bread wielding ninja.",
    model: "dall-e-2",
    style: "natural",
    size: "512x512",
    quality: "standard",
    n: 1,
    response_format: "b64_json",
  });

  console.log(response);
  const rawImage = response.data[0].b64_json!;

  if (rawImage) {
    writeFile("ninjaImg", Buffer.from(rawImage, "base64"), (err) => {
      err
        ? console.log("An error occurred")
        : console.log("File created successfully!");
    });
  }
}

const generateAdvancedImg = async () => {
  const response = await openai.images.generate({
    prompt: "Photo of a village at night with the stars and moon.",
    model: "dall-e-3",
    quality: "hd",
    size: "1024x1024",
    response_format: "b64_json",
  });

  const rawImage = response.data[0].b64_json!;
  if (rawImage) {
    writeFile("ninjaImg", Buffer.from(rawImage, "base64"), (err) => {
      err
        ? console.log("An error occurred")
        : console.log("File created successfully!");
    });
  }
};

const generateImageVariation = async () => {
  const response = await openai.images.createVariation({
    // should be a png file
    image: createReadStream("ninja-ai.png"),
    model: "dall-e-2",
    response_format: "b64_json",
    n: 1,
  });

  const rawImage = response.data[0].b64_json;
  if (rawImage) {
    writeFileSync("ninja-ai-variation.png", Buffer.from(rawImage, "base64"));
  }
};

const editGeneratedImage = async () => {
  const response = await openai.images.edit({
    image: createReadStream("city.png"),
    mask: createReadStream("cityMask.png"),
    prompt: "add a full moon to the city.",
    model: "dall-e-2",
    response_format: "b64_json",
  });

  const rawImage = response.data[0].b64_json;
  if (rawImage) {
    writeFileSync("cityEdited.png", Buffer.from(rawImage, "base64"));
  }
};

generateFreeImage();
generateFreeLocalImage();
generateAdvancedImg();
generateImageVariation();
editGeneratedImage();
