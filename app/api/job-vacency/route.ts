import { NextResponse } from "next/server";
import { getAllJobVacancies } from "@/db/queries/jobVacency.queries";

export async function GET() {
  try {
    const jobs = await getAllJobVacancies();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch job vacancies" },
      { status: 500 },
    );
  }
}
