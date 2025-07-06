import { NextRequest, NextResponse } from "next/server";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/db/queries/exprience.queries";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await createExperience(data);
  return NextResponse.json(result[0]);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  const result = await updateExperience(id, data);
  return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const result = await deleteExperience(id);
  return NextResponse.json(result[0]);
}
