import type { z } from "zod";

import type {
  companyDiagnosticsParamsSchema,
  createDiagnosticAnswerSchema,
  createDiagnosticSchema,
  diagnosticAnswerSchema,
  diagnosticParamsSchema,
  diagnosticSchema,
  diagnosticStatusSchema,
  diagnosticsListSchema,
} from "./diagnostics.schemas.js";

export type DiagnosticStatus = z.infer<typeof diagnosticStatusSchema>;
export type DiagnosticParams = z.infer<typeof diagnosticParamsSchema>;
export type CompanyDiagnosticsParams = z.infer<
  typeof companyDiagnosticsParamsSchema
>;
export type CreateDiagnosticInput = z.infer<typeof createDiagnosticSchema>;
export type CreateDiagnosticAnswerInput = z.infer<
  typeof createDiagnosticAnswerSchema
>;
export type Diagnostic = z.infer<typeof diagnosticSchema>;
export type DiagnosticsList = z.infer<typeof diagnosticsListSchema>;
export type DiagnosticAnswer = z.infer<typeof diagnosticAnswerSchema>;

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
