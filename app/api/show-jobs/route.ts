import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import {
  getPrivateJobsByUserId,
  deletePrivateJob,
  updatePrivateJob,
} from "@/db/queries/privateJobs.queries";
import {
  getGovernmentJobsByUserId,
  deleteGovernmentJob,
  updateGovernmentJob,
} from "@/db/queries/govtJobs.queries";

/**
 * GET /api/show-jobs
 *
 * Optional query param:
 *   jobType = "private" | "government"
 *
 * If jobType is provided, only that category will be returned.
 * Otherwise, both privateJobs and governmentJobs arrays are returned.
 */
export async function GET(request: NextRequest) {
  try {
    // Authorize user
    const session = await auth();
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId: string = (session.user as any).id;

    // Determine which jobs to fetch based on query param
    const jobType = request.nextUrl.searchParams.get("jobType");

    if (jobType === "private") {
      const jobs = await getPrivateJobsByUserId(userId);
      return NextResponse.json({ data: jobs }, { status: 200 });
    }

    if (jobType === "government") {
      const jobs = await getGovernmentJobsByUserId(userId);
      return NextResponse.json({ data: jobs }, { status: 200 });
    }

    // If no jobType provided, return both lists
    const [privateJobs, governmentJobs] = await Promise.all([
      getPrivateJobsByUserId(userId),
      getGovernmentJobsByUserId(userId),
    ]);

    return NextResponse.json(
      { data: { privateJobs, governmentJobs } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching jobs", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/show-jobs?jobType=private|government&jobId=xxx
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId: string = (session.user as any).id;
    const jobType = request.nextUrl.searchParams.get("jobType");
    const jobId = request.nextUrl.searchParams.get("jobId");
    if (!jobType || !jobId) {
      return NextResponse.json(
        { message: "Missing jobType or jobId" },
        { status: 400 },
      );
    }
    let deletedJob;
    if (jobType === "private") {
      deletedJob = await deletePrivateJob(jobId, userId);
    } else if (jobType === "government") {
      deletedJob = await deleteGovernmentJob(jobId, userId);
    } else {
      return NextResponse.json({ message: "Invalid jobType" }, { status: 400 });
    }
    if (!deletedJob) {
      return NextResponse.json(
        { message: "Job not found or not authorized" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: deletedJob },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting job", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/show-jobs?jobType=private|government&jobId=xxx
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId: string = (session.user as any).id;
    console.log("User ID:", userId);
    const jobType = request.nextUrl.searchParams.get("jobType");
    const jobId = request.nextUrl.searchParams.get("jobId");
    if (!jobType || !jobId) {
      return NextResponse.json(
        { message: "Missing jobType or jobId" },
        { status: 400 },
      );
    }
    const body = await request.json();
    let updatedJob;
    if (jobType === "private") {
      updatedJob = await updatePrivateJob(jobId, body);
    } else if (jobType === "government") {
      updatedJob = await updateGovernmentJob(jobId, body);
    } else {
      return NextResponse.json({ message: "Invalid jobType" }, { status: 400 });
    }
    if (!updatedJob) {
      return NextResponse.json(
        { message: "Job not found or not authorized" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: updatedJob },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating job", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
