import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";
import { companies } from "./companies.js";
import { diagnostics } from "./diagnostics.js";

export const reportFormat = pgEnum("report_format", ["pdf", "excel"]);
export const reportKind = pgEnum("report_kind", ["manual_diagnostic"]);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    diagnosticId: uuid("diagnostic_id").references(() => diagnostics.id, {
      onDelete: "set null",
    }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    kind: reportKind("kind").default("manual_diagnostic").notNull(),
    format: reportFormat("format").notNull(),
    title: text("title").notNull(),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type").notNull(),
    content: jsonb("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("reports_company_id_idx").on(table.companyId),
    index("reports_diagnostic_id_idx").on(table.diagnosticId),
    index("reports_created_by_user_id_idx").on(table.createdByUserId),
    index("reports_format_idx").on(table.format),
  ],
);
