import {
  pgTable,
  uuid,
  varchar,
  date,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user.schema";

export const experience = pgTable("experience", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  company: varchar("company", { length: 150 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  description: text("description"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export type Experience = typeof experience.$inferSelect;
export type NewExperience = typeof experience.$inferInsert;
