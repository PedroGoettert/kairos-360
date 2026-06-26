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

export const diagnosticTemplates = pgTable(
  "diagnostic_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("diagnostic_templates_slug_idx").on(table.slug),
    index("diagnostic_templates_name_idx").on(table.name),
  ],
);

export const diagnosticTemplateAreas = pgTable(
  "diagnostic_template_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    templateId: uuid("template_id")
      .notNull()
      .references(() => diagnosticTemplates.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("diagnostic_template_areas_template_id_idx").on(table.templateId),
    index("diagnostic_template_areas_display_order_idx").on(table.displayOrder),
    uniqueIndex("diagnostic_template_areas_template_slug_idx").on(
      table.templateId,
      table.slug,
    ),
  ],
);

export const diagnosticTemplateQuestions = pgTable(
  "diagnostic_template_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    templateAreaId: uuid("template_area_id")
      .notNull()
      .references(() => diagnosticTemplateAreas.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("diagnostic_template_questions_area_id_idx").on(table.templateAreaId),
    index("diagnostic_template_questions_display_order_idx").on(
      table.displayOrder,
    ),
  ],
);
