import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

// Helper function to process image from URL or base64
async function processImageContent(imageContent: string): Promise<any> {
  try {
    // It's a URL
    const imageResponse = await fetch(imageContent);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    return {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

// Helper function to process PDF from URL or base64
async function processPDFContent(pdfContent: string): Promise<any> {
  try {
    // It's a URL
    const pdfResponse = await fetch(pdfContent);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64PDF = Buffer.from(pdfBuffer).toString("base64");

    return {
      inlineData: {
        data: base64PDF,
        mimeType: "application/pdf",
      },
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { files, message } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare content for Gemini API
    const contentParts: any[] = [];

    contentParts.push(message);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileLabel = file.name || `File ${i + 1}`;

      if (file.type === "image") {
        try {
          const imagePart = await processImageContent(file.content);
          contentParts.push(`\n--- ${fileLabel} (Image) ---\n`);
          contentParts.push(imagePart);
        } catch (imageError) {
          console.error(`Error processing image ${fileLabel}:`, imageError);
          contentParts.push(`\n--- ${fileLabel} (Image - Error loading) ---\n`);
        }
      } else if (file.type === "pdf") {
        try {
          const pdfPart = await processPDFContent(file.content);
          contentParts.push(`\n--- ${fileLabel} (PDF) ---\n`);
          contentParts.push(pdfPart);
        } catch (pdfError) {
          console.error(`Error processing PDF ${fileLabel}:`, pdfError);
          contentParts.push(`\n--- ${fileLabel} (PDF - Error loading) ---\n`);
        }
      }
    }

    // Generate content with Gemini
    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI Response:", text);

    return NextResponse.json({
      success: true,
      data: text,
      rawResponse: text,
      filesProcessed: files.length,
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error processing request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
