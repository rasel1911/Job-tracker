import { eq } from "drizzle-orm";
import { db } from "../connection";
import { users, type User, type NewUser } from "../schema/user.schema";

export async function createUser(userData: NewUser): Promise<User> {
  try {
    const [newUser] = await db.insert(users).values(userData).returning();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(
  userId: string,
  userData: Partial<Omit<NewUser, "id" | "createdAt">>,
): Promise<User> {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(
  userId: string,
): Promise<{ success: boolean }> {
  try {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (!deletedUser) {
      throw new Error("User not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user by email");
  }
}
