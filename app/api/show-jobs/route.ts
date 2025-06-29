import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { getPrivateJobsByUserId } from "@/db/queries/privateJobs.queries";
import { getGovernmentJobsByUserId } from "@/db/queries/govtJobs.queries";

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
