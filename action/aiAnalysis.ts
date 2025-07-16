import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function aiAnalysis(content: any) {
  const result = await model.generateContent(content);
  const response = await result.response;
  const text = response.text();
  return text;
}
