import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";
import { companyDiagnosticAreas } from "./company-diagnostic-areas.js";
import { companies } from "./companies.js";
import { diagnostics } from "./diagnostics.js";

export const actionPlanStatus = pgEnum("action_plan_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const actionPlans = pgTable(
  "action_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    diagnosticId: uuid("diagnostic_id").references(() => diagnostics.id, {
      onDelete: "set null",
    }),
    areaId: uuid("area_id").references(() => companyDiagnosticAreas.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    responsible: text("responsible"),
    dueDate: timestamp("due_date"),
    status: actionPlanStatus("status").default("not_started").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("action_plans_company_id_idx").on(table.companyId),
    index("action_plans_created_by_user_id_idx").on(table.createdByUserId),
    index("action_plans_diagnostic_id_idx").on(table.diagnosticId),
    index("action_plans_area_id_idx").on(table.areaId),
    index("action_plans_status_idx").on(table.status),
  ],
);
