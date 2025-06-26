import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user.schema";

export const governmentJobs = pgTable("government_jobs", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  applyStartDate: date("apply_start_date").notNull(),
  applyEndDate: date("apply_end_date").notNull(),
  circularFile: varchar("circular_file", { length: 512 }),
  admitCardFile: varchar("admit_card_file", { length: 512 }),
  examDate: date("exam_date"),
  note: text("note"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Types
export type GovernmentJob = typeof governmentJobs.$inferSelect;
export type NewGovernmentJob = typeof governmentJobs.$inferInsert;
