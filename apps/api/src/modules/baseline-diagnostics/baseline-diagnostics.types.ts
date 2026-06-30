import type { z } from "zod";

import type {
  baselineDiagnosticAnswerParamsSchema,
  baselineDiagnosticAnswerSchema,
  baselineDiagnosticAnswersListSchema,
  baselineDiagnosticHealthClassificationSchema,
  baselineDiagnosticParamsSchema,
  baselineDiagnosticSchema,
  baselineDiagnosticScoresSummarySchema,
  baselineDiagnosticStatusSchema,
  baselineDiagnosticsListSchema,
  createBaselineDiagnosticAnswerSchema,
  createBaselineDiagnosticSchema,
  updateBaselineDiagnosticAnswerSchema,
} from "./baseline-diagnostics.schemas.js";

export type BaselineDiagnosticStatus = z.infer<
  typeof baselineDiagnosticStatusSchema
>;
export type BaselineDiagnosticParams = z.infer<
  typeof baselineDiagnosticParamsSchema
>;
export type BaselineDiagnosticAnswerParams = z.infer<
  typeof baselineDiagnosticAnswerParamsSchema
>;
export type CreateBaselineDiagnosticInput = z.infer<
  typeof createBaselineDiagnosticSchema
>;
export type CreateBaselineDiagnosticAnswerInput = z.infer<
  typeof createBaselineDiagnosticAnswerSchema
>;
export type UpdateBaselineDiagnosticAnswerInput = z.infer<
  typeof updateBaselineDiagnosticAnswerSchema
>;
export type BaselineDiagnostic = z.infer<typeof baselineDiagnosticSchema>;
export type BaselineDiagnosticsList = z.infer<
  typeof baselineDiagnosticsListSchema
>;
export type BaselineDiagnosticAnswer = z.infer<
  typeof baselineDiagnosticAnswerSchema
>;
export type BaselineDiagnosticAnswersList = z.infer<
  typeof baselineDiagnosticAnswersListSchema
>;
export type BaselineDiagnosticHealthClassification = z.infer<
  typeof baselineDiagnosticHealthClassificationSchema
>;
export type BaselineDiagnosticScoresSummary = z.infer<
  typeof baselineDiagnosticScoresSummarySchema
>;

export type CreateBaselineDiagnosticResult =
  | { status: "created"; diagnostic: BaselineDiagnostic }
  | { status: "organization_not_found" | "baseline_not_configured" };

export type CreateBaselineDiagnosticAnswerResult =
  | { status: "created"; answer: BaselineDiagnosticAnswer }
  | {
      status:
        | "diagnostic_not_found"
        | "diagnostic_completed"
        | "question_not_found"
        | "answer_already_exists";
    };

export type UpdateBaselineDiagnosticAnswerResult =
  | { status: "updated"; answer: BaselineDiagnosticAnswer }
  | { status: "answer_not_found" | "diagnostic_completed" };

export type DeleteBaselineDiagnosticAnswerResult =
  | { status: "deleted"; answer: BaselineDiagnosticAnswer }
  | { status: "answer_not_found" | "diagnostic_completed" };

export type CompleteBaselineDiagnosticResult =
  | { status: "completed"; summary: BaselineDiagnosticScoresSummary }
  | {
      status:
        | "diagnostic_not_found"
        | "diagnostic_completed"
        | "insufficient_answers";
    };

export type GetBaselineDiagnosticScoresResult =
  | { status: "found"; summary: BaselineDiagnosticScoresSummary }
  | { status: "diagnostic_not_found" | "diagnostic_not_completed" };
