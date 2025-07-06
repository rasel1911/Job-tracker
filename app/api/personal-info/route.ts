import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/db/queries/user.queries";

// GET /api/personal-info?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Map DB user fields to personal info fields
    const personalInfo = {
      fullName: user.name,
      email: user.email,
      phone: user.phoneNumber,
      address: "", // Address not in schema, return empty or fetch from another source
    };
    return NextResponse.json(personalInfo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 },
    );
  }
}

// PUT /api/personal-info
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, fullName, email, phone } = body;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const updatedUser = await updateUser(userId, {
      name: fullName,
      email,
      phoneNumber: phone,
    });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user info" },
      { status: 500 },
    );
  }
}

// DELETE /api/personal-info?userId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  try {
    await deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
