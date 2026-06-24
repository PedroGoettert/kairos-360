import type { z } from "zod";

import type {
  companyDiagnosticsParamsSchema,
  createDiagnosticSchema,
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
export type Diagnostic = z.infer<typeof diagnosticSchema>;
export type DiagnosticsList = z.infer<typeof diagnosticsListSchema>;
