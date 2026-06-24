import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { diagnosticQuestions } from "./diagnostic-questions.js";
import { diagnostics } from "./diagnostics.js";

export const diagnosticAnswers = pgTable(
  "diagnostic_answers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    diagnosticId: uuid("diagnostic_id")
      .notNull()
      .references(() => diagnostics.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => diagnosticQuestions.id, { onDelete: "restrict" }),
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
      "diagnostic_answers_score_range_check",
      sql`${table.score} >= 0 AND ${table.score} <= 10`,
    ),
    index("diagnostic_answers_diagnostic_id_idx").on(table.diagnosticId),
    index("diagnostic_answers_question_id_idx").on(table.questionId),
    uniqueIndex("diagnostic_answers_diagnostic_question_idx").on(
      table.diagnosticId,
      table.questionId,
    ),
  ],
);
