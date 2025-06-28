import { and, eq } from "drizzle-orm";
import { db } from "../connection";

import {
  userInformation,
  type UserInformation,
  type NewUserInformation,
} from "../schema/userInformation.schema";

export const createUserInformation = async (info: NewUserInformation) => {
  const [newInfo] = await db.insert(userInformation).values(info).returning();
  return newInfo;
};

export const getUserInformationById = async (id: string) => {
  const [info] = await db
    .select()
    .from(userInformation)
    .where(eq(userInformation.id, id));
  return info;
};

export const getUserInformationByUserId = async (userId: string) => {
  const [info] = await db
    .select()
    .from(userInformation)
    .where(eq(userInformation.userId, userId));
  return info;
};

export const updateUserInformation = async (
  id: string,
  info: Partial<UserInformation>,
) => {
  const [updatedInfo] = await db
    .update(userInformation)
    .set({ ...info, updatedAt: new Date() })
    .where(eq(userInformation.id, id))
    .returning();
  return updatedInfo;
};

export const upsertUserInformation = async (
  userId: string,
  info: Partial<UserInformation>,
) => {
  const existingInfo = await getUserInformationByUserId(userId);

  if (existingInfo) {
    return updateUserInformation(existingInfo.id, info);
  } else {
    return createUserInformation({
      ...info,
      userId,
    } as NewUserInformation);
  }
};

export const deleteUserInformation = async (id: string, userId: string) => {
  const [deletedInfo] = await db
    .delete(userInformation)
    .where(and(eq(userInformation.id, id), eq(userInformation.userId, userId)))
    .returning();
  return deletedInfo;
};

export const getUserCV = async (userId: string) => {
  const [info] = await db
    .select({ cv: userInformation.cv })
    .from(userInformation)
    .where(eq(userInformation.userId, userId));
  return info?.cv;
};

export const updateUserCV = async (userId: string, cvPath: string) => {
  const [updatedInfo] = await db
    .update(userInformation)
    .set({ cv: cvPath, updatedAt: new Date() })
    .where(eq(userInformation.userId, userId))
    .returning();
  return updatedInfo;
};
