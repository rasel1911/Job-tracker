import { db } from "../connection";
import { academic } from "../schema/academic.schema";
import { eq } from "drizzle-orm";

// Create academic record
export async function createAcademic(
  data: Omit<typeof academic.$inferInsert, "id">,
) {
  return db.insert(academic).values(data).returning();
}

// Update academic record
export async function updateAcademic(
  id: string,
  data: Partial<Omit<typeof academic.$inferInsert, "id">>,
) {
  return db.update(academic).set(data).where(eq(academic.id, id)).returning();
}

// Delete academic record
export async function deleteAcademic(id: string) {
  return db.delete(academic).where(eq(academic.id, id)).returning();
}

// Get all academic records for a user
export async function getAcademicsByUser(userId: string) {
  return db.select().from(academic).where(eq(academic.userId, userId));
}
