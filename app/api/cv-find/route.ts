import { NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { userFileQueries } from "@/db/queries/userFile.queries";

export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const files = await userFileQueries.getUserFilesByType(userId, "cv_file");
    return NextResponse.json({ data: files });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch CV files" },
      { status: 500 },
    );
  }
}
