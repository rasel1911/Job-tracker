import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

// Zod schema for the extracted data
const ExtractedDataSchema = z.object({
  companyName: z.string().default("none"),
  jobTitle: z.string().default("none"),
  email: z.string().email().or(z.literal("none")).default("none"),
  applyDate: z.string().default("none"),
});

type ExtractedData = z.infer<typeof ExtractedDataSchema>;

// Function to extract structured data from text
function extractStructuredData(text: string): ExtractedData {
  const extractedData: Partial<ExtractedData> = {};

  // Extract email
  const emailMatch = text.match(
    /(?:email|e-mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
  );
  extractedData.email = emailMatch ? emailMatch[1] : "none";

  // Extract company name
  const companyMatch = text.match(
    /(?:company|organization|employer):\s*([a-zA-Z0-9\s.,'&()-]+?)(?:\n|$|\.)/i,
  );
  extractedData.companyName = companyMatch ? companyMatch[1].trim() : "none";

  // Extract job title
  const jobTitleMatch = text.match(
    /(?:job title|position|role|title):\s*([a-zA-Z0-9\s.,'&()-]+?)(?:\n|$|\.)/i,
  );
  extractedData.jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : "none";

  // Extract apply date
  const applyDateMatch = text.match(
    /(?:apply date|application date|date applied|applied on):\s*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}|[0-9]{1,2}-[0-9]{1,2}-[0-9]{2,4}|\d{4}-\d{2}-\d{2}|[A-Za-z]+ \d{1,2}, \d{4})/i,
  );
  extractedData.applyDate = applyDateMatch ? applyDateMatch[1].trim() : "none";

  // Validate and return with defaults
  return ExtractedDataSchema.parse(extractedData);
}

// Enhanced prompt for better extraction
const EXTRACTION_PROMPT = `
  Please analyze the provided content and extract the following information in this exact format:
  
  Company: [company name]
  Job Title: [job position/title]
  Email: [email address]
  Apply Date: [application date]
  
  If any information is not available, write "Not available" for that field.
  Focus on finding:
  - Company/Organization name
  - Job title/position
  - Email address (any valid email)
  - Application date or date applied
  
  Content to analyze:
  `;

function fileToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const message = formData.get("message") as string;

    if (!file || !message) {
      return NextResponse.json(
        { error: "Image and message are required" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare the image part for Gemini
    const imagePart = fileToGenerativePart(buffer, file.type);

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let result;
    const enhancedPrompt =
      EXTRACTION_PROMPT + (message || "What's in this image?");

    // Create the prompt combining user message with image analysis request
    //const prompt = `${message}\n\nPlease analyze the provided image and respond according to the message above.`;

    // Generate content with both text and image
    result = await model.generateContent([enhancedPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    console.log("output", text);
    const extractedData = extractStructuredData(text);
    console.log("Extracted Data:", extractedData);
    console.log("Extracted company name:", extractedData.companyName);
    return NextResponse.json({
      success: true,
      analysis: text,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 },
    );
  }
}
