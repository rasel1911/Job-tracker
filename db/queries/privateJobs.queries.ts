import { and, eq } from "drizzle-orm";
import { db } from "../connection";

import {
  privateJobs,
  type PrivateJob,
  type NewPrivateJob,
} from "../schema/privateJobs.schema";

export const createPrivateJob = async (job: NewPrivateJob) => {
  const [newJob] = await db.insert(privateJobs).values(job).returning();
  return newJob;
};

export const getPrivateJobById = async (id: string) => {
  const [job] = await db
    .select()
    .from(privateJobs)
    .where(eq(privateJobs.id, id));
  return job;
};

export const getPrivateJobsByUserId = async (userId: string) => {
  const jobs = await db
    .select()
    .from(privateJobs)
    .where(eq(privateJobs.userId, userId));
  return jobs;
};

export const updatePrivateJob = async (
  id: string,
  job: Partial<PrivateJob>,
) => {
  const [updatedJob] = await db
    .update(privateJobs)
    .set({ ...job, updatedAt: new Date() })
    .where(eq(privateJobs.id, id))
    .returning();
  return updatedJob;
};

export const deletePrivateJob = async (id: string, userId: string) => {
  const [deletedJob] = await db
    .delete(privateJobs)
    .where(and(eq(privateJobs.id, id), eq(privateJobs.userId, userId)))
    .returning();
  return deletedJob;
};

export const getUpcomingPrivateJobs = async (userId: string, limit = 5) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const jobs = await db
    .select()
    .from(privateJobs)
    .where(
      and(
        eq(privateJobs.userId, userId),
        sql`${privateJobs.applyEndDate} >= ${currentDate}`,
      ),
    )
    .orderBy(privateJobs.applyEndDate)
    .limit(limit);
  return jobs;
};

// For complex queries that need raw SQL
import { sql } from "drizzle-orm";
