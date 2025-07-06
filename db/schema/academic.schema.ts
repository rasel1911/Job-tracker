import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user.schema";

export const academic = pgTable("academic", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  degree: varchar("degree", { length: 100 }).notNull(),
  institution: varchar("institution", { length: 150 }).notNull(),
  subject: varchar("subject", { length: 100 }),
  field: varchar("field", { length: 100 }),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  grade: varchar("grade", { length: 20 }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export type Academic = typeof academic.$inferSelect;
export type NewAcademic = typeof academic.$inferInsert;
