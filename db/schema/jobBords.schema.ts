import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const publicAddJobs = pgTable("public_add_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userID: uuid("user_id").notNull(),
  org_name: varchar("org_name", { length: 255 }).notNull(),
  org_name_bn: varchar("org_name_bn", { length: 255 }),
  file_link: text("file_link").notNull(),
  apply_last_date: timestamp("apply_last_date", { withTimezone: true }),
  comment: text("comment"),
  apply_link: text("apply_link"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
