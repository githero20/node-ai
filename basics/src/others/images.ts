import OpenAI from "openai";
import { writeFileSync, writeFile } from "fs";

const openai = new OpenAI();

async function generateFreeImage() {
  const response = await openai.images.generate({
    prompt: "A photo of a bread wielding ninja.",
    model: "dall-e-2",
    style: "natural",
    size: "512x512",
    quality: "standard",
    n: 1,
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

generateFreeImage();
