import { publicAddJobs } from "../schema/jobBords.schema";
import { db } from "../connection";
import { eq } from "drizzle-orm";

export type Job = typeof publicAddJobs.$inferInsert;
export type JobUpdate = Partial<typeof publicAddJobs.$inferInsert>;

// Create a new job
export async function createJob(jobData: Job) {
  return await db.insert(publicAddJobs).values(jobData).returning();
}

// Edit a job by id
export async function editJob(id: string, updatedData: JobUpdate) {
  return await db
    .update(publicAddJobs)
    .set(updatedData)
    .where(eq(publicAddJobs.id, id))
    .returning();
}

// Delete a job by id
export async function deleteJob(id: string) {
  return await db
    .delete(publicAddJobs)
    .where(eq(publicAddJobs.id, id))
    .returning();
}

// View all jobs
export async function getAllJobs() {
  return await db.select().from(publicAddJobs);
}

// View job by id
export async function getJobById(id: string) {
  return await db.select().from(publicAddJobs).where(eq(publicAddJobs.id, id));
}
