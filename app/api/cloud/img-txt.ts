import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message, imageUrl } = (await request.json()) as {
      message: string;
      imageUrl?: string;
    };

    if (!message && !imageUrl) {
      return NextResponse.json(
        { message: "Message or image URL is required" },
        { status: 400 },
      );
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let result;

    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");
      const mimeType =
        imageResponse.headers.get("content-type") || "image/jpeg";

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      };

      result = await model.generateContent([
        message || "What's in this image?",
        imagePart,
      ]);
    } else {
      result = await model.generateContent(message);
    }

    const response = await result.response;
    const text = response.text();
    const emailMatch = text.match(/Email:\s*([a-zA-Z0-9._%+-]+@gmail\.com)/i);
    const companyNameMatch = text.match(/Company:\s*([a-zA-Z0-9\s.,'&()-]+)/i);

    const email = emailMatch ? emailMatch[1] : "Not found";
    const companyName = companyNameMatch ? companyNameMatch[1] : "Not found";
    console.log(email, companyName);

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 },
    );
  }
}
