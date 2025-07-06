import { NextRequest, NextResponse } from "next/server";
import {
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/db/queries/skill.queries";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await createSkill(data);
  return NextResponse.json(result[0]);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  const result = await updateSkill(id, data);
  return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const result = await deleteSkill(id);
  return NextResponse.json(result[0]);
}
