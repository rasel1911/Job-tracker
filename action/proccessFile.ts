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
export { processImageContent, processPDFContent };
