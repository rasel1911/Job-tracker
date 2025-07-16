import {
  pgTable,
  uuid,
  integer,
  varchar,
  text,
  json,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const jobVacancies = pgTable("job_vacancies", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  jobId: integer("job_id").notNull().unique(),
  orgName: varchar("org_name", { length: 255 }).notNull(),
  orgId: integer("org_id"),
  jobTitle: varchar("job_title", { length: 255 }),
  jobTitleBn: varchar("job_title_bn", { length: 255 }),
  jobVacancy: text("job_vacancy"),
  applyLastDate: timestamp("apply_last_date"),
  applyStartDate: timestamp("apply_start_date"),
  urlLink: varchar("url_link", { length: 255 }),
  fileLink: json("file_link"),
  comment: json("comment"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export type JobVacancy = typeof jobVacancies.$inferSelect;
export type NewJobVacancy = typeof jobVacancies.$inferInsert;
