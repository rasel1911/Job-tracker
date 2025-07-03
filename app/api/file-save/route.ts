import { NextRequest, NextResponse } from "next/server";
import { userFileQueries } from "@/db/queries/userFile.queries";
import { getSession } from "@/lib/getSession";
import { fileTypeEnum } from "@/db/schema/userFile.schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, imageUrl } = body;
    console.log("Received data:", {
      name,
      type,
      imageUrl,
      sessionUserId: session.user.id,
    });

    if (!name || !type || !fileTypeEnum.enumValues.includes(type)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newFile = await userFileQueries.createUserFile({
      userId: session.user.id,
      name,
      type,
      imageUrl,
    });

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error) {
    console.error("File save error:", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Failed to save file", details: String(error) },
      { status: 500 },
    );
  }
}
