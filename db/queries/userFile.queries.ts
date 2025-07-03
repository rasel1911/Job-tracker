// File: db/queries/userFile.queries.ts
import { db } from "../connection";
import {
  userFiles,
  type UserFile,
  type NewUserFile,
} from "../schema/userFile.schema";
import { eq, and } from "drizzle-orm";

export const userFileQueries = {
  /**
   * Create a new user file
   */
  async createUserFile(data: NewUserFile): Promise<UserFile> {
    const [file] = await db.insert(userFiles).values(data).returning();
    return file;
  },

  /**
   * Get a single user file by ID
   */
  async getUserFileById(id: string): Promise<UserFile | undefined> {
    const [file] = await db
      .select()
      .from(userFiles)
      .where(eq(userFiles.id, id));
    return file;
  },

  /**
   * Get all files for a specific user
   */
  async getUserFiles(userId: string): Promise<UserFile[]> {
    return db.select().from(userFiles).where(eq(userFiles.userId, userId));
  },

  /**
   * Get all files for a specific user by file type
   */
  async getUserFilesByType(userId: string, type: string): Promise<UserFile[]> {
    return db
      .select()
      .from(userFiles)
      .where(and(eq(userFiles.userId, userId), eq(userFiles.type, type)));
  },

  /**
   * Update a user file
   */
  async updateUserFile(
    id: string,
    userId: string,
    data: Partial<Omit<NewUserFile, "id" | "userId" | "createdAt">>,
  ): Promise<UserFile | undefined> {
    const [file] = await db
      .update(userFiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(userFiles.id, id), eq(userFiles.userId, userId)))
      .returning();
    return file;
  },

  /**
   * Delete a user file
   */
  async deleteUserFile(id: string, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(userFiles)
      .where(and(eq(userFiles.id, id), eq(userFiles.userId, userId)))
      .returning({ id: userFiles.id });

    return !!deleted;
  },

  /**
   * Check if a file belongs to a user
   */
  async isFileOwner(fileId: string, userId: string): Promise<boolean> {
    const [file] = await db
      .select({ id: userFiles.id })
      .from(userFiles)
      .where(and(eq(userFiles.id, fileId), eq(userFiles.userId, userId)));

    return !!file;
  },
};
