import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { NewJobVacancy } from "@/db/schema/jobVacency.schema";
import { processImageContent, processPDFContent } from "@/action/aiAnalysis";

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
 Job Title: [jobTitle]\n 
  Job Title (Bangla): [jobTitleBn]\n 
  পদ সংখ্যা (jobVacancy): [jobVacancy]\n
  Application Last Date: [applyLastDate]\n 
  Application Start Date: [applyStartDate]\n
  URL Link: [apply link]\n  
  If any information is not available, write "Not available" for that field.\n  
  Focus on finding:\n 
          - Organization name and ID\n 
          - Job title (English and Bangla)\n 
          - Job vacancy\n  
          - Application last and start dates\n 
          - URL and file links\n  
          Content to analyze:\n  `;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const message = formData.get("message") as string;
    const finalMessage = message || "What's in this content?";
    const files: any[] = [];
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const buffer = await (file as Blob).arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      files.push({
        name: (file as File).name || "Uploaded File",
        type: (file as File).type.includes("pdf") ? "pdf" : "image",
        content: `data:${(file as File).type};base64,${base64}`,
      });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const contentParts: any[] = [];
    contentParts.push(finalMessage);
    contentParts.push(EXTRACTION_PROMPT);

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
    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();
    console.log("Raw AI Response:", text);
    const extractedData = extractStructuredData(text);
    console.log("Extracted Data:", extractedData);
    // Prepare data for database insertion

    //FIXME : AI government job Analysis Need to be fixed
    //FIXME : jobTitle and jobVacency in array

    const newVacancy: NewJobVacancy = {
      jobId: Math.floor(Math.random() * 1000000),
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
    };
    console.log("New Job Vacancy Data:", newVacancy);
    return NextResponse.json({
      success: true,
      analysis: extractedData,
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
