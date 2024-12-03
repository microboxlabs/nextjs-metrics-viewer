import { sql } from "drizzle-orm";
import { check } from "drizzle-orm/sqlite-core";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const users = sqliteTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`datetime('now')`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`datetime('now')`),
  },
  (table) => ({
    isActiveCheckConstraint: check(
      "user_is_active_check",
      sql`${table.isActive} IN (0, 1)`,
    ),
    roleCheckConstraint: check(
      "user_role_check",
      sql`${table.role} IN ('admin', 'regular')`,
    ),
  }),
);
