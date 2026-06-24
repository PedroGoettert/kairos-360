import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const diagnosticAreas = pgTable(
  "diagnostic_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull(),
    isDefault: boolean("is_default").default(true).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("diagnostic_areas_slug_idx").on(table.slug),
    index("diagnostic_areas_display_order_idx").on(table.displayOrder),
  ],
);
