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

import { companies } from "./companies.js";
import { diagnosticTemplateAreas, diagnosticTemplateQuestions } from "./diagnostic-templates.js";

export const companyDiagnosticAreas = pgTable(
  "company_diagnostic_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    templateAreaId: uuid("template_area_id").references(
      () => diagnosticTemplateAreas.id,
      { onDelete: "set null" },
    ),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
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
    index("company_diagnostic_areas_company_id_idx").on(table.companyId),
    index("company_diagnostic_areas_display_order_idx").on(table.displayOrder),
    uniqueIndex("company_diagnostic_areas_company_slug_idx").on(
      table.companyId,
      table.slug,
    ),
  ],
);

export const companyDiagnosticQuestions = pgTable(
  "company_diagnostic_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyAreaId: uuid("company_area_id")
      .notNull()
      .references(() => companyDiagnosticAreas.id, { onDelete: "cascade" }),
    templateQuestionId: uuid("template_question_id").references(
      () => diagnosticTemplateQuestions.id,
      { onDelete: "set null" },
    ),
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
    index("company_diagnostic_questions_area_id_idx").on(table.companyAreaId),
    index("company_diagnostic_questions_display_order_idx").on(
      table.displayOrder,
    ),
  ],
);
