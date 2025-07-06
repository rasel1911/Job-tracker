import { eq, and } from "drizzle-orm";
import { db } from "../connection";
import { skill, type Skill, type NewSkill } from "../schema/skill.schema";

export const createSkill = async (data: NewSkill): Promise<Skill> => {
  const [newSkill] = await db.insert(skill).values(data).returning();
  return newSkill;
};

export const getSkillById = async (id: string): Promise<Skill | null> => {
  const [result] = await db.select().from(skill).where(eq(skill.id, id));
  return result || null;
};

export const getSkillsByUserId = async (userId: string): Promise<Skill[]> => {
  return db.select().from(skill).where(eq(skill.userId, userId));
};

export const updateSkill = async (
  id: string,
  data: Partial<Omit<NewSkill, "id" | "createdAt">>,
): Promise<Skill | null> => {
  const [updatedSkill] = await db
    .update(skill)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(skill.id, id))
    .returning();
  return updatedSkill || null;
};

export const deleteSkill = async (
  id: string,
  userId: string,
): Promise<{ success: boolean }> => {
  const [deletedSkill] = await db
    .delete(skill)
    .where(and(eq(skill.id, id), eq(skill.userId, userId)))
    .returning({ id: skill.id });
  if (!deletedSkill) return { success: false };
  return { success: true };
};
