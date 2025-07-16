import { NextResponse } from "next/server";
import { processImageContent, processPDFContent } from "@/action/proccessFile";
import { aiAnalysis } from "@/action/aiAnalysis";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { files, message } = body;
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
    const text = await aiAnalysis(contentParts);

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
