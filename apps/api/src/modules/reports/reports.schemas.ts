import { z } from "zod";

import {
  diagnosticAnswerWithQuestionSchema,
  diagnosticScoresSummarySchema,
} from "../diagnostics/diagnostics.schemas.js";

export const reportParamsSchema = z.object({
  id: z.uuid(),
});

export const diagnosticReportParamsSchema = z.object({
  diagnosticId: z.uuid(),
});

export const reportFormatSchema = z.enum(["pdf", "excel"]);
export const reportKindSchema = z.enum(["manual_diagnostic"]);

export const reportCompanySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  tradeName: z.string().nullable(),
  industry: z.string().nullable(),
  website: z.string().nullable(),
});

export const manualDiagnosticReportContentSchema = z.object({
  company: reportCompanySchema,
  diagnostic: z.object({
    id: z.uuid(),
    title: z.string().nullable(),
    notes: z.string().nullable(),
    status: z.enum(["draft", "completed"]),
    completedAt: z.date().nullable(),
    createdAt: z.date(),
  }),
  scores: diagnosticScoresSummarySchema,
  answers: z.array(diagnosticAnswerWithQuestionSchema),
});

export const reportSchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  diagnosticId: z.uuid().nullable(),
  createdByUserId: z.string(),
  kind: reportKindSchema,
  format: reportFormatSchema,
  title: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  content: manualDiagnosticReportContentSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
