import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";
import { companies } from "./companies.js";

export const diagnosticStatus = pgEnum("diagnostic_status", [
  "draft",
  "completed",
]);

export const diagnostics = pgTable(
  "diagnostics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    title: text("title"),
    notes: text("notes"),
    status: diagnosticStatus("status").default("draft").notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("diagnostics_company_id_idx").on(table.companyId),
    index("diagnostics_created_by_user_id_idx").on(table.createdByUserId),
    index("diagnostics_status_idx").on(table.status),
  ],
);
