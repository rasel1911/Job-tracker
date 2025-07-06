import { NextRequest, NextResponse } from "next/server";
import {
  createAcademic,
  updateAcademic,
  deleteAcademic,
  getAcademicsByUser,
} from "@/db/queries/academic.queries";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  const result = await getAcademicsByUser(userId);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("Creating academic record with data:", data);
  const result = await createAcademic(data);
  return NextResponse.json(result[0]);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  const result = await updateAcademic(id, data);
  return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const result = await deleteAcademic(id);
  return NextResponse.json(result[0]);
}
