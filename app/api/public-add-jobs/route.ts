import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createJob, getAllJobs } from "@/db/queries/jobBords.queries";
import { publicAddJobs } from "@/db/schema/jobBords.schema";

// Type representing insertable job (excluding auto fields)
export type NewPublicJob = typeof publicAddJobs.$inferInsert;

export async function GET() {
  try {
    const jobs = await getAllJobs();
    return NextResponse.json({ data: jobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching public jobs", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUserId: string | undefined = (session?.user as any)?.id;
    const body = await request.json();

    const {
      userID,
      org_name,
      org_name_bn,
      file_link,
      apply_last_date,
      comment,
      apply_link,
    } = body ?? {};

    // Determine the user id
    const finalUserId = sessionUserId || userID;
    if (!finalUserId) {
      return NextResponse.json(
        { message: "Unauthorized: user not found" },
        { status: 401 },
      );
    }

    // Basic validation
    if (!org_name || !file_link) {
      return NextResponse.json(
        { message: "org_name and file_link are required" },
        { status: 400 },
      );
    }

    const newJob: NewPublicJob = {
      userID: finalUserId,
      org_name,
      org_name_bn,
      file_link,
      comment,
      apply_link,
      apply_last_date: apply_last_date ? new Date(apply_last_date) : undefined,
    } as NewPublicJob;

    const createdJob = await createJob(newJob);

    return NextResponse.json({ data: createdJob }, { status: 201 });
  } catch (error) {
    console.error("Error adding public job", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
