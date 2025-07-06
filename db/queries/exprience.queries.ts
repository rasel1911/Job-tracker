import { db } from "../connection";
import { experience } from "../schema/exprience.schema";
import { eq } from "drizzle-orm";

// Create a new experience
export async function createExperience(
  data: Omit<typeof experience.$inferInsert, "id">,
) {
  return db.insert(experience).values(data).returning();
}

// Update an experience by id
export async function updateExperience(
  id: number,
  data: Partial<typeof experience.$inferInsert>,
) {
  return db
    .update(experience)
    .set(data)
    .where(eq(experience.id, id))
    .returning();
}

// Delete an experience by id
export async function deleteExperience(id: number) {
  return db.delete(experience).where(eq(experience.id, id)).returning();
}
