import { z } from "zod";

import { actionPlanStatusSchema } from "../action-plans/action-plans.schemas.js";
import {
  baselineDiagnosticHealthClassificationSchema,
  baselineDiagnosticScoresSummarySchema,
} from "../baseline-diagnostics/baseline-diagnostics.schemas.js";
import {
  diagnosticHealthClassificationSchema,
  diagnosticScoresSummarySchema,
} from "../diagnostics/diagnostics.schemas.js";

export const companyDashboardParamsSchema = z.object({
  companyId: z.uuid(),
});

export const dashboardHealthStatusSchema =
  baselineDiagnosticHealthClassificationSchema;
export const dashboardTrendDirectionSchema = z.enum([
  "declining",
  "stable",
  "improving",
]);
export const dashboardSignalSeveritySchema = z.enum([
  "critical",
  "warning",
  "info",
]);

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

export const organizationDashboardMetricSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  value: z.string(),
  change: z.string(),
  trend: dashboardTrendDirectionSchema,
  context: z.string(),
});

export const organizationDashboardSignalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: dashboardSignalSeveritySchema,
  detectedAt: z.string(),
});

export const organizationDashboardHistoryPointSchema = z.object({
  label: z.string(),
  score: z.number(),
});

export const organizationDashboardBottleneckSchema = z.object({
  rank: z.number().int().positive(),
  slug: z.string(),
  areaName: z.string(),
  score: z.number(),
  status: dashboardHealthStatusSchema,
  trend: dashboardTrendDirectionSchema,
  change: z.number(),
  impact: z.enum(["high", "medium", "low"]),
  summary: z.string(),
  recommendation: z.string(),
  metrics: z.array(organizationDashboardMetricSchema),
  signals: z.array(organizationDashboardSignalSchema),
  history: z.array(organizationDashboardHistoryPointSchema),
});

export const organizationDashboardActionPlanSchema = z.object({
  id: z.string(),
  areaSlug: z.string(),
  title: z.string(),
  responsible: z.string(),
  dueDate: z.string(),
  status: actionPlanStatusSchema,
  progress: z.number(),
});

export const organizationDashboardHealthSchema = z.object({
  score: z.number(),
  status: dashboardHealthStatusSchema,
  trend: dashboardTrendDirectionSchema,
  change: z.number(),
});

export const organizationDashboardSchema = z.object({
  organization: z.object({
    id: z.uuid(),
    name: z.string(),
    tradeName: z.string(),
    industry: z.string(),
  }),
  connection: z.object({
    status: z.enum(["connected", "updating", "disconnected"]),
    lastUpdatedLabel: z.string(),
    refreshIntervalSeconds: z.number().int().nonnegative(),
  }),
  health: organizationDashboardHealthSchema.nullable(),
  bottlenecks: z.array(organizationDashboardBottleneckSchema),
  headlineMetrics: z.array(organizationDashboardMetricSchema),
  recentSignals: z.array(organizationDashboardSignalSchema),
  actionPlans: z.array(organizationDashboardActionPlanSchema),
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
