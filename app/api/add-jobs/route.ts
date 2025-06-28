import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPrivateJob } from "@/db/queries/privateJobs.queries";
import { type NewPrivateJob } from "@/db/schema/privateJobs.schema";
import { createGovernmentJob } from "@/db/queries/govtJobs.queries";
import { type NewGovernmentJob } from "@/db/schema/govtJobs.schema";

/**
 * POST /api/add-jobs
 * Expects JSON body:
 * {
 *   jobType: "private" | "government",
 *   payload: { ...schemaFields }
 * }
 * The `payload` must contain all required fields as defined in the respective schema
 * except `userId`, `createdAt`, `updatedAt` which are added automatically.
 */
export async function POST(request: NextRequest) {
  try {
    // Authorize user
    const session = await auth();
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId: string = (session.user as any).id;
    // Parse request body
    const { jobType, payload } = await request.json();

    if (!jobType || !payload) {
      return NextResponse.json(
        { message: "jobType and payload are required" },
        { status: 400 },
      );
    }

    let createdJob;

    if (jobType === "private") {
      const newJob: NewPrivateJob = {
        ...payload,
        userId,
      } as NewPrivateJob;
      createdJob = await createPrivateJob(newJob);
    } else if (jobType === "government") {
      const newJob: NewGovernmentJob = {
        ...payload,
        userId,
      } as NewGovernmentJob;
      createdJob = await createGovernmentJob(newJob);
    } else {
      return NextResponse.json(
        { message: "Invalid jobType. Must be 'private' or 'government'" },
        { status: 400 },
      );
    }

    return NextResponse.json({ data: createdJob }, { status: 201 });
  } catch (error) {
    console.error("Error adding job", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
