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

import {
  diagnosticTemplateAreas,
  diagnosticTemplateQuestions,
} from "./diagnostic-templates.js";
import { organizations } from "./organizations.js";

export const organizationBaselineAreas = pgTable(
  "organization_baseline_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "restrict" }),
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
    index("organization_baseline_areas_organization_id_idx").on(
      table.organizationId,
    ),
    index("organization_baseline_areas_display_order_idx").on(
      table.displayOrder,
    ),
    uniqueIndex("organization_baseline_areas_org_slug_idx").on(
      table.organizationId,
      table.slug,
    ),
  ],
);

export const organizationBaselineQuestions = pgTable(
  "organization_baseline_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationAreaId: uuid("organization_area_id")
      .notNull()
      .references(() => organizationBaselineAreas.id, { onDelete: "cascade" }),
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
    index("organization_baseline_questions_area_id_idx").on(
      table.organizationAreaId,
    ),
    index("organization_baseline_questions_display_order_idx").on(
      table.displayOrder,
    ),
  ],
);
