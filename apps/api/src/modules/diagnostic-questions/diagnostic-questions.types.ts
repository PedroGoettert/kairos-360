import type { z } from "zod";

import type {
  createDiagnosticQuestionSchema,
  diagnosticAreasWithQuestionsSchema,
  diagnosticAreaWithQuestionsSchema,
  diagnosticAreaParamsSchema,
  diagnosticQuestionSchema,
} from "./diagnostic-questions.schemas.js";

export type DiagnosticAreaParams = z.infer<typeof diagnosticAreaParamsSchema>;
export type CreateDiagnosticQuestionInput = z.infer<
  typeof createDiagnosticQuestionSchema
>;
export type DiagnosticQuestion = z.infer<typeof diagnosticQuestionSchema>;
export type DiagnosticAreaWithQuestions = z.infer<
  typeof diagnosticAreaWithQuestionsSchema
>;
export type DiagnosticAreasWithQuestions = z.infer<
  typeof diagnosticAreasWithQuestionsSchema
>;

export type CreateDiagnosticQuestionResult =
  | {
      status: "created";
      question: DiagnosticQuestion;
    }
  | {
      status: "area_not_found" | "question_already_exists";
    };
