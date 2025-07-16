import {
  pgTable,
  uuid,
  varchar,
  date,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user.schema";

export const jobStatus = pgEnum("job_status", [
  "applied",
  "in progress",
  "interview",
  "offer",
]);

export const privateJobs = pgTable("private_jobs", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  applyEndDate: date("apply_end_date").notNull(),
  circularFile: text("circular_file"), // Store file path or URL
  status: jobStatus("status").notNull(),
  examDate: date("exam_date"),
  note: text("note"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export type PrivateJob = typeof privateJobs.$inferSelect;
export type NewPrivateJob = typeof privateJobs.$inferInsert;
