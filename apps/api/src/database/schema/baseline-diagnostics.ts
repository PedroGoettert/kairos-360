import { sql } from "drizzle-orm";
import {
  check,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";
import {
  organizationBaselineAreas,
  organizationBaselineQuestions,
} from "./organization-baseline.js";
import { organizations } from "./organizations.js";

export const baselineDiagnosticStatus = pgEnum("baseline_diagnostic_status", [
  "draft",
  "completed",
]);

export const baselineDiagnostics = pgTable(
  "baseline_diagnostics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "restrict" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    title: text("title"),
    notes: text("notes"),
    status: baselineDiagnosticStatus("status").default("draft").notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("baseline_diagnostics_organization_id_idx").on(table.organizationId),
    index("baseline_diagnostics_created_by_user_id_idx").on(
      table.createdByUserId,
    ),
    index("baseline_diagnostics_status_idx").on(table.status),
  ],
);

export const baselineDiagnosticAnswers = pgTable(
  "baseline_diagnostic_answers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    diagnosticId: uuid("diagnostic_id")
      .notNull()
      .references(() => baselineDiagnostics.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => organizationBaselineQuestions.id, {
        onDelete: "restrict",
      }),
    score: integer("score").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    check(
      "baseline_diagnostic_answers_score_range_check",
      sql`${table.score} >= 0 AND ${table.score} <= 10`,
    ),
    index("baseline_diagnostic_answers_diagnostic_id_idx").on(table.diagnosticId),
    index("baseline_diagnostic_answers_question_id_idx").on(table.questionId),
    uniqueIndex("baseline_diagnostic_answers_diagnostic_question_idx").on(
      table.diagnosticId,
      table.questionId,
    ),
  ],
);

export const baselineDiagnosticScores = pgTable(
  "baseline_diagnostic_scores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    diagnosticId: uuid("diagnostic_id")
      .notNull()
      .references(() => baselineDiagnostics.id, { onDelete: "cascade" }),
    areaId: uuid("area_id")
      .notNull()
      .references(() => organizationBaselineAreas.id, { onDelete: "restrict" }),
    score: doublePrecision("score").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("baseline_diagnostic_scores_diagnostic_id_idx").on(table.diagnosticId),
    index("baseline_diagnostic_scores_area_id_idx").on(table.areaId),
    uniqueIndex("baseline_diagnostic_scores_diagnostic_area_idx").on(
      table.diagnosticId,
      table.areaId,
    ),
  ],
);
