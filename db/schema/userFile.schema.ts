import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  foreignKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const fileTypeEnum = pgEnum("file_type", [
  "cv_file",
  "photo",
  "others_file",
]);

export const userFiles = pgTable(
  "user_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    type: fileTypeEnum("type"),
    imageUrl: varchar("image_url", { length: 512 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userFileUserFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_file_user_fk",
    }),
  }),
);

export type UserFile = typeof userFiles.$inferSelect;
export type NewUserFile = typeof userFiles.$inferInsert;
