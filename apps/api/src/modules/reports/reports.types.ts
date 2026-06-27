import type { z } from "zod";

import type {
  diagnosticReportParamsSchema,
  reportFormatSchema,
  reportParamsSchema,
  reportSchema,
} from "./reports.schemas.js";

export type ReportParams = z.infer<typeof reportParamsSchema>;
export type DiagnosticReportParams = z.infer<typeof diagnosticReportParamsSchema>;
export type ReportFormat = z.infer<typeof reportFormatSchema>;
export type Report = z.infer<typeof reportSchema>;

export type CreateManualDiagnosticReportResult =
  | {
      status: "created";
      report: Report;
    }
  | {
      status: "diagnostic_not_found" | "diagnostic_not_completed";
    };
