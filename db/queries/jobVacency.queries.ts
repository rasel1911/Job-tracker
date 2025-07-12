import { db } from "../connection";
import { jobVacancies } from "../schema/jobVacency.schema";
import { eq } from "drizzle-orm";

// Get all job vacancies
export async function getAllJobVacancies() {
  console.log("Fetching all job vacancies");
  return db.select().from(jobVacancies);
}

// Get a job vacancy by its UUID
export async function getJobVacancyById(id: string) {
  return db.select().from(jobVacancies).where(eq(jobVacancies.id, id));
}

// Get job vacancies by organization ID
export async function getJobVacanciesByOrgId(orgId: number) {
  return db.select().from(jobVacancies).where(eq(jobVacancies.orgId, orgId));
}

// Get a job vacancy by jobId
export async function getJobVacancyByJobId(jobId: number) {
  return db.select().from(jobVacancies).where(eq(jobVacancies.jobId, jobId));
}

// Create a new job vacancy
export async function createJobVacancy(data: any) {
  return db.insert(jobVacancies).values(data).returning();
}
