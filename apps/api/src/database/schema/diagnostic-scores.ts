import {
  doublePrecision,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { diagnosticAreas } from "./diagnostic-areas.js";
import { diagnostics } from "./diagnostics.js";

export const diagnosticScores = pgTable(
  "diagnostic_scores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    diagnosticId: uuid("diagnostic_id")
      .notNull()
      .references(() => diagnostics.id, { onDelete: "cascade" }),
    areaId: uuid("area_id")
      .notNull()
      .references(() => diagnosticAreas.id, { onDelete: "restrict" }),
    score: doublePrecision("score").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("diagnostic_scores_diagnostic_id_idx").on(table.diagnosticId),
    index("diagnostic_scores_area_id_idx").on(table.areaId),
    uniqueIndex("diagnostic_scores_diagnostic_area_idx").on(
      table.diagnosticId,
      table.areaId,
    ),
  ],
);
