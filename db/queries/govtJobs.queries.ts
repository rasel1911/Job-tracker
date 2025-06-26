import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  governmentJobs,
  type GovernmentJob,
  type NewGovernmentJob,
} from "../schema/govtJobs.schema";

export const createGovernmentJob = async (job: NewGovernmentJob) => {
  const [newJob] = await db.insert(governmentJobs).values(job).returning();
  return newJob;
};

export const getGovernmentJobById = async (id: string) => {
  const [job] = await db
    .select()
    .from(governmentJobs)
    .where(eq(governmentJobs.id, id));
  return job;
};

export const getGovernmentJobsByUserId = async (userId: string) => {
  const jobs = await db
    .select()
    .from(governmentJobs)
    .where(eq(governmentJobs.userId, userId));
  return jobs;
};

export const updateGovernmentJob = async (
  id: string,
  job: Partial<GovernmentJob>,
) => {
  const [updatedJob] = await db
    .update(governmentJobs)
    .set({ ...job, updatedAt: new Date() })
    .where(eq(governmentJobs.id, id))
    .returning();
  return updatedJob;
};

export const deleteGovernmentJob = async (id: string, userId: string) => {
  const [deletedJob] = await db
    .delete(governmentJobs)
    .where(and(eq(governmentJobs.id, id), eq(governmentJobs.userId, userId)))
    .returning();
  return deletedJob;
};

export const getUpcomingGovernmentJobs = async (userId: string, limit = 5) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const jobs = await db
    .select()
    .from(governmentJobs)
    .where(
      and(
        eq(governmentJobs.userId, userId),
        sql`${governmentJobs.applyEndDate} >= ${currentDate}`,
      ),
    )
    .orderBy(governmentJobs.applyEndDate)
    .limit(limit);
  return jobs;
};

// For complex queries that need raw SQL
import { sql } from "drizzle-orm";
