import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const { message, imageUrl } = (await request.json()) as {
      message: string;
      imageUrl?: string;
    };

    if (!message && !imageUrl) {
      return NextResponse.json(
        {
          error: "Message or image URL is required",
          data: ExtractedDataSchema.parse({}),
        },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let result;
    const enhancedPrompt =
      EXTRACTION_PROMPT + (message || "What's in this image?");

    if (imageUrl) {
      try {
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.status}`);
        }

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

        result = await model.generateContent([enhancedPrompt, imagePart]);
      } catch (imageError) {
        console.error("Error processing image:", imageError);
        return NextResponse.json(
          {
            error: "Error processing image",
            data: ExtractedDataSchema.parse({}),
          },
          { status: 400 },
        );
      }
    } else {
      result = await model.generateContent(enhancedPrompt);
    }

    const response = await result.response;
    const text = response.text();

    console.log("Raw AI Response:", text);

    // Extract structured data using Zod validation
    const extractedData = extractStructuredData(text);

    console.log("Extracted Data:", extractedData);
    console.log("Raw AI Response:", extractedData.companyName);

    return NextResponse.json({
      success: true,
      data: text,
      rawResponse: text, // Optional: include raw response for debugging
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error processing request",
        details: error instanceof Error ? error.message : "Unknown error",
        data: ExtractedDataSchema.parse({}), // Return default structure even on error
      },
      { status: 500 },
    );
  }
}
