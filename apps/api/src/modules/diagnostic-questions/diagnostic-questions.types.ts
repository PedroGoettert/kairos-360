import type { z } from "zod";

import type {
  diagnosticAreasWithQuestionsSchema,
  diagnosticAreaWithQuestionsSchema,
  diagnosticQuestionSchema,
} from "./diagnostic-questions.schemas.js";

export type DiagnosticQuestion = z.infer<typeof diagnosticQuestionSchema>;
export type DiagnosticAreaWithQuestions = z.infer<
  typeof diagnosticAreaWithQuestionsSchema
>;
export type DiagnosticAreasWithQuestions = z.infer<
  typeof diagnosticAreasWithQuestionsSchema
>;
