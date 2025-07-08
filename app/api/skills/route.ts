import { NextRequest, NextResponse } from "next/server";
import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByUserId,
} from "@/db/queries/skill.queries";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const skills = await getSkillsByUserId(session.user.id);
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();

  const result = await createSkill({ ...data, userId: session.user.id });
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, ...data } = await req.json();
  const result = await updateSkill(id, { ...data, userId: session.user.id });
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const result = await deleteSkill(id, session.user.id);
  return NextResponse.json(result);
}
