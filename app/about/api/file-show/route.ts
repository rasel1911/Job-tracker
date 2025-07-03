import { NextResponse } from "next/server";
import { userFileQueries } from "@/db/queries/userFile.queries";
import { getSession } from "@/lib/getSession";

// Map DB file types to frontend types
const mapFileType = (type: string | null) => {
  switch (type) {
    case "cv_file":
      return "cv";
    case "photo":
      return "photo";
    case "others_file":
      return "other";
    default:
      return "other";
  }
};

export async function GET() {
  // Get user from session
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await userFileQueries.getUserFiles(userId);
    // Map DB files to frontend format
    const mappedFiles = files.map((file) => ({
      id: file.id,
      name: file.name,
      type: mapFileType(file.type),
      url: file.imageUrl || "",
      size: 0, // Size not stored in DB; set to 0 or fetch from storage if available
      uploadDate: file.createdAt,
    }));
    return NextResponse.json(mappedFiles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
