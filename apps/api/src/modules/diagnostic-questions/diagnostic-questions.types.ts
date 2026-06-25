import type { z } from "zod";

import type {
  createDiagnosticQuestionSchema,
  diagnosticAreasWithQuestionsSchema,
  diagnosticAreaWithQuestionsSchema,
  diagnosticAreaParamsSchema,
  diagnosticQuestionParamsSchema,
  diagnosticQuestionSchema,
  updateDiagnosticQuestionSchema,
  updateDiagnosticQuestionStatusSchema,
} from "./diagnostic-questions.schemas.js";

export type DiagnosticAreaParams = z.infer<typeof diagnosticAreaParamsSchema>;
export type DiagnosticQuestionParams = z.infer<
  typeof diagnosticQuestionParamsSchema
>;
export type CreateDiagnosticQuestionInput = z.infer<
  typeof createDiagnosticQuestionSchema
>;
export type UpdateDiagnosticQuestionInput = z.infer<
  typeof updateDiagnosticQuestionSchema
>;
export type UpdateDiagnosticQuestionStatusInput = z.infer<
  typeof updateDiagnosticQuestionStatusSchema
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

export type UpdateDiagnosticQuestionResult =
  | {
      status: "updated";
      question: DiagnosticQuestion;
    }
  | {
      status: "question_not_found" | "question_already_exists";
    };

export type GetDiagnosticAreaByIdResult =
  | {
      status: "found";
      area: DiagnosticAreaWithQuestions;
    }
  | {
      status: "area_not_found";
    };
