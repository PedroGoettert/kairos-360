import { z } from "zod";

import { actionPlanStatusSchema } from "../action-plans/action-plans.schemas.js";
import {
  diagnosticHealthClassificationSchema,
  diagnosticScoresSummarySchema,
} from "../diagnostics/diagnostics.schemas.js";

export const companyDashboardParamsSchema = z.object({
  companyId: z.uuid(),
});

export const dashboardDiagnosticSummarySchema = z.object({
  id: z.uuid(),
  title: z.string().nullable(),
  status: z.enum(["draft", "completed"]),
  createdAt: z.date(),
  completedAt: z.date().nullable(),
});

export const dashboardActionPlanSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  responsible: z.string().nullable(),
  dueDate: z.date().nullable(),
  status: actionPlanStatusSchema,
});

export const companyDashboardSchema = z.object({
  company: z.object({
    id: z.uuid(),
    name: z.string(),
    tradeName: z.string().nullable(),
    industry: z.string().nullable(),
  }),
  diagnostics: z.object({
    total: z.number().int(),
    completed: z.number().int(),
    draft: z.number().int(),
    latestCompleted: dashboardDiagnosticSummarySchema.nullable(),
    latestDraft: dashboardDiagnosticSummarySchema.nullable(),
  }),
  latestScores: diagnosticScoresSummarySchema.nullable(),
  healthClassification: diagnosticHealthClassificationSchema.nullable(),
  actionPlans: z.object({
    total: z.number().int(),
    notStarted: z.number().int(),
    inProgress: z.number().int(),
    completed: z.number().int(),
    recent: z.array(dashboardActionPlanSchema),
  }),
});
