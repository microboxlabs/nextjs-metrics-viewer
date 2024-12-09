import { integer, real } from "drizzle-orm/sqlite-core";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const analytics = sqliteTable("analytics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  date: integer("date", { mode: "timestamp" }).notNull(),
  category: text("category").notNull(),
  value: real("value").notNull(),
});
