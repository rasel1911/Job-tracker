import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createJobVacancy } from "@/db/queries/jobVacency.queries";
import { NewJobVacancy } from "@/db/schema/jobVacency.schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

// Zod schema for the extracted data
const ExtractedDataSchema = z.object({
  orgName: z.string().default("Not available"),
  jobTitle: z.string().default("Not available"),
  jobTitleBn: z.string().default("Not available"),
  jobVacancy: z.string().default("Not available"),
  applyLastDate: z.string().default("Not available"),
  applyStartDate: z.string().default("Not available"),
  urlLink: z.string().default("Not available"),
  fileLink: z.string().default("Not available"),
  comment: z.string().default("Not available"),
});

type ExtractedData = z.infer<typeof ExtractedDataSchema>;

// Function to extract structured data from text
function extractStructuredData(text: string): ExtractedData {
  const extractedData: Partial<ExtractedData> = {};

  // Helper function to extract field by label
  function extractField(label: string, text: string) {
    const regex = new RegExp(`${label}:\\s*(.*?)(?:\\n|$)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "Not available";
  }

  extractedData.orgName = extractField("Organization Name", text);
  extractedData.jobTitle = extractField("Job Title", text);
  extractedData.jobTitleBn = extractField("Job Title (Bangla)", text);
  extractedData.jobVacancy = extractField("Job Vacancy Description", text);
  extractedData.applyLastDate = extractField("Application Last Date", text);
  extractedData.applyStartDate = extractField("Application Start Date", text);
  extractedData.urlLink = extractField("URL Link", text);
  extractedData.fileLink = extractField("File Link", text);
  extractedData.comment = extractField("Comment", text);

  return ExtractedDataSchema.parse(extractedData);
}

// Enhanced prompt for better extraction
const EXTRACTION_PROMPT = `\n  Please analyze the provided content and extract the following information in this exact format:\n  
\n  Organization Name: [orgName]\n 
 Organization ID: [orgId]\n  
 Job Title: [jobTitle]\n 
  Job Title (Bangla): [jobTitleBn]\n 
  Job Vacancy Description: [jobVacancy]\n 
  Application Last Date: [applyLastDate]\n 
  Application Start Date: [applyStartDate]\n
  URL Link: [apply link]\n  
  Comment: [comment]\n  \n 
  If any information is not available, write "Not available" for that field.\n  
  Focus on finding:\n 
          - Organization name and ID\n 
          - Job title (English and Bangla)\n 
          - Job vacancy description\n  
          - Application last and start dates\n 
          - URL and file links\n  
          - Any comments or notes\n  
          Content to analyze:\n  `;

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
    const message = "describe this image";

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

    // Generate content with both text and image
    result = await model.generateContent([enhancedPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    console.log("output", text);
    const extractedData = extractStructuredData(text);
    console.log("Extracted Data:", extractedData);

    // Prepare data for database insertion
    const newVacancy: NewJobVacancy = {
      jobId: Math.floor(Math.random() * 1000000), // Random jobId for uniqueness
      orgName:
        extractedData.orgName !== "Not available"
          ? extractedData.orgName
          : "Not available",
      jobTitle:
        extractedData.jobTitle !== "Not available"
          ? extractedData.jobTitle
          : "Not available",
      jobTitleBn:
        extractedData.jobTitleBn !== "Not available"
          ? extractedData.jobTitleBn
          : "Not available",
      jobVacancy:
        extractedData.jobVacancy !== "Not available"
          ? extractedData.jobVacancy
          : "Not available",
      applyLastDate:
        extractedData.applyLastDate !== "Not available"
          ? new Date(extractedData.applyLastDate)
          : undefined,
      applyStartDate:
        extractedData.applyStartDate !== "Not available"
          ? new Date(extractedData.applyStartDate)
          : undefined,
      urlLink:
        extractedData.urlLink !== "Not available"
          ? extractedData.urlLink
          : undefined,
      fileLink:
        extractedData.fileLink !== "Not available"
          ? extractedData.fileLink
          : undefined,
      comment:
        extractedData.comment !== "Not available"
          ? extractedData.comment
          : undefined,
      // createdAt and updatedAt are handled by DB defaults
    };

    // Save to database if required fields are present
    console.log("New Job Vacancy Data:", newVacancy);
    if (newVacancy.orgName && newVacancy.jobTitle) {
      const createdJob = await createJobVacancy(newVacancy);
      console.log("Created Job Vacancy:", createdJob);
      return NextResponse.json({
        success: true,
        analysis: extractedData,
        databaseResult: createdJob,
      });
    }

    return NextResponse.json({
      success: true,
      analysis: extractedData,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 },
    );
  }
}
