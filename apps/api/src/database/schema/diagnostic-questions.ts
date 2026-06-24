import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { diagnosticAreas } from "./diagnostic-areas.js";

export const diagnosticQuestions = pgTable(
  "diagnostic_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    areaId: uuid("area_id")
      .notNull()
      .references(() => diagnosticAreas.id, { onDelete: "restrict" }),
    question: text("question").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("diagnostic_questions_area_id_idx").on(table.areaId),
    index("diagnostic_questions_display_order_idx").on(table.displayOrder),
  ],
);
