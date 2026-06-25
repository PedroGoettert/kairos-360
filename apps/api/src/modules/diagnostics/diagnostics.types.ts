import type { z } from "zod";

import type {
  companyDiagnosticsParamsSchema,
  createDiagnosticAnswerSchema,
  createDiagnosticSchema,
  diagnosticAnswerParamsSchema,
  diagnosticAnswerSchema,
  diagnosticAnswersListSchema,
  diagnosticParamsSchema,
  diagnosticSchema,
  diagnosticStatusSchema,
  diagnosticsListSchema,
  updateDiagnosticAnswerSchema,
} from "./diagnostics.schemas.js";

export type DiagnosticStatus = z.infer<typeof diagnosticStatusSchema>;
export type DiagnosticParams = z.infer<typeof diagnosticParamsSchema>;
export type DiagnosticAnswerParams = z.infer<
  typeof diagnosticAnswerParamsSchema
>;
export type CompanyDiagnosticsParams = z.infer<
  typeof companyDiagnosticsParamsSchema
>;
export type CreateDiagnosticInput = z.infer<typeof createDiagnosticSchema>;
export type CreateDiagnosticAnswerInput = z.infer<
  typeof createDiagnosticAnswerSchema
>;
export type UpdateDiagnosticAnswerInput = z.infer<
  typeof updateDiagnosticAnswerSchema
>;
export type Diagnostic = z.infer<typeof diagnosticSchema>;
export type DiagnosticsList = z.infer<typeof diagnosticsListSchema>;
export type DiagnosticAnswer = z.infer<typeof diagnosticAnswerSchema>;
export type DiagnosticAnswersList = z.infer<typeof diagnosticAnswersListSchema>;

export type CreateDiagnosticAnswerResult =
  | {
      status: "created";
      answer: DiagnosticAnswer;
    }
  | {
      status:
        | "diagnostic_not_found"
        | "diagnostic_completed"
        | "question_not_found"
        | "answer_already_exists";
    };

export type UpdateDiagnosticAnswerResult =
  | {
      status: "updated";
      answer: DiagnosticAnswer;
    }
  | {
      status: "answer_not_found" | "diagnostic_completed";
    };
