// app/api/image-analysis/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = file.type;
  const imageBase64 = `data:${mime};base64,${base64}`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract all readable text from this image:" },
          { type: "image_url", image_url: { url: imageBase64 } },
        ],
      },
    ],
  });

  const text = result.choices[0].message.content;
  return NextResponse.json({ text });
}
