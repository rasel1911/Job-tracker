import { NextRequest, NextResponse } from "next/server";
import { userFileQueries } from "@/db/queries/userFile.queries";

// DELETE /about/api/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const fileId = params.id;
    // For real apps, get userId from session/auth middleware
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const deleted = await userFileQueries.deleteUserFile(fileId, userId);
    if (!deleted) {
      return NextResponse.json(
        { error: "File not found or not owned by user" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
