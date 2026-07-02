import {
  date,
  doublePrecision,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";
import { organizations } from "./organizations.js";

export const manualMetricCategory = pgEnum("manual_metric_category", [
  "marketing",
  "sales",
  "finance",
  "operations",
  "customer_service",
  "hr",
  "management",
]);

export const manualMetrics = pgTable(
  "manual_metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "restrict" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    category: manualMetricCategory("category").notNull(),
    metricKey: text("metric_key").notNull(),
    metricLabel: text("metric_label").notNull(),
    value: doublePrecision("value").notNull(),
    unit: text("unit"),
    referenceDate: date("reference_date", { mode: "date" }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("manual_metrics_organization_id_idx").on(table.organizationId),
    index("manual_metrics_created_by_user_id_idx").on(table.createdByUserId),
    index("manual_metrics_category_idx").on(table.category),
    index("manual_metrics_metric_key_idx").on(table.metricKey),
    index("manual_metrics_reference_date_idx").on(table.referenceDate),
  ],
);
