import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user.schema";

export const userInformation = pgTable("user_information", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  address: text("address"),
  ssc: jsonb("ssc"),
  hsc: jsonb("hsc"),
  bsc: jsonb("bsc"),
  masters: jsonb("masters"),
  training: jsonb("training"),
  experience: jsonb("experience"),
  skill: text("skill"),
  cv: text("cv"), // Store file path or URL
  portfolio: text("portfolio"),
  image: text("image"), // Store file path or URL
  signatureImage: text("signature_image"), // Store file path or URL
  note: text("note"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export type UserInformation = typeof userInformation.$inferSelect;
export type NewUserInformation = typeof userInformation.$inferInsert;
