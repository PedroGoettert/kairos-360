import { and, desc, eq } from "drizzle-orm";

import { canViewOrganization } from "../../auth/organization-permissions.js";
import { db } from "../../database/index.js";
import {
  actionPlans,
  baselineDiagnostics,
  companies,
  diagnostics,
  manualMetrics,
} from "../../database/schema/index.js";
import { getBaselineDiagnosticScores } from "../baseline-diagnostics/baseline-diagnostics.service.js";
import type { BaselineDiagnosticScoresSummary } from "../baseline-diagnostics/baseline-diagnostics.types.js";
import { getCompanyById } from "../companies/companies.service.js";
import { getDiagnosticScores } from "../diagnostics/diagnostics.service.js";
import { getCurrentOrganizationMembership } from "../organizations/organizations.service.js";
import type {
  CompanyDashboard,
  GetCompanyDashboardResult,
  GetOrganizationDashboardResult,
  OrganizationDashboard,
} from "./dashboard.types.js";

export async function getCompanyDashboard(
  currentUserId: string,
  companyId: string,
): Promise<GetCompanyDashboardResult> {
  const company = await getCompanyById(currentUserId, companyId);

  if (!company) {
    return { status: "company_not_found" };
  }

  const companyDiagnostics = await db
    .select({
      id: diagnostics.id,
      title: diagnostics.title,
      status: diagnostics.status,
      createdAt: diagnostics.createdAt,
      completedAt: diagnostics.completedAt,
    })
    .from(diagnostics)
    .where(eq(diagnostics.companyId, companyId))
    .orderBy(desc(diagnostics.createdAt));

  const latestCompleted =
    companyDiagnostics.find((diagnostic) => diagnostic.status === "completed") ??
    null;
  const latestDraft =
    companyDiagnostics.find((diagnostic) => diagnostic.status === "draft") ?? null;

  const latestScoresResult =
    latestCompleted === null
      ? null
      : await getDiagnosticScores(currentUserId, latestCompleted.id);
  const latestScores =
    latestScoresResult?.status === "found" ? latestScoresResult.summary : null;

  const recentActionPlans = await db
    .select({
      id: actionPlans.id,
      title: actionPlans.title,
      responsible: actionPlans.responsible,
      dueDate: actionPlans.dueDate,
      status: actionPlans.status,
    })
    .from(actionPlans)
    .innerJoin(companies, eq(actionPlans.companyId, companies.id))
    .where(
      and(
        eq(actionPlans.companyId, companyId),
        eq(companies.ownerUserId, currentUserId),
      ),
    )
    .orderBy(desc(actionPlans.createdAt))
    .limit(5);

  const allActionPlans = await db
    .select({
      status: actionPlans.status,
    })
    .from(actionPlans)
    .innerJoin(companies, eq(actionPlans.companyId, companies.id))
    .where(
      and(
        eq(actionPlans.companyId, companyId),
        eq(companies.ownerUserId, currentUserId),
      ),
    );

  const dashboard: CompanyDashboard = {
    company: {
      id: company.id,
      name: company.name,
      tradeName: company.tradeName,
      industry: company.industry,
    },
    diagnostics: {
      total: companyDiagnostics.length,
      completed: companyDiagnostics.filter(
        (diagnostic) => diagnostic.status === "completed",
      ).length,
      draft: companyDiagnostics.filter((diagnostic) => diagnostic.status === "draft")
        .length,
      latestCompleted,
      latestDraft,
    },
    latestScores,
    healthClassification: latestScores?.healthClassification ?? null,
    actionPlans: {
      total: allActionPlans.length,
      notStarted: allActionPlans.filter((plan) => plan.status === "not_started")
        .length,
      inProgress: allActionPlans.filter((plan) => plan.status === "in_progress")
        .length,
      completed: allActionPlans.filter((plan) => plan.status === "completed")
        .length,
      recent: recentActionPlans,
    },
  };

  return {
    status: "found",
    dashboard,
  };
}

export async function getOrganizationDashboard(
  currentUserId: string,
): Promise<GetOrganizationDashboardResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership || !canViewOrganization(membership.role)) {
    return { status: "organization_not_found" };
  }

  const latestCompletedBaseline = await db
    .select({
      id: baselineDiagnostics.id,
      title: baselineDiagnostics.title,
      completedAt: baselineDiagnostics.completedAt,
    })
    .from(baselineDiagnostics)
    .where(
      and(
        eq(baselineDiagnostics.organizationId, membership.organization.id),
        eq(baselineDiagnostics.status, "completed"),
      ),
    )
    .orderBy(desc(baselineDiagnostics.completedAt), desc(baselineDiagnostics.createdAt))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  const latestScoresResult = latestCompletedBaseline
    ? await getBaselineDiagnosticScores(currentUserId, latestCompletedBaseline.id)
    : null;
  const latestScores =
    latestScoresResult?.status === "found" ? latestScoresResult.summary : null;

  const rawManualMetrics = await db
    .select()
    .from(manualMetrics)
    .where(eq(manualMetrics.organizationId, membership.organization.id))
    .orderBy(desc(manualMetrics.referenceDate), desc(manualMetrics.createdAt));

  const headlineMetrics = buildHeadlineMetrics(rawManualMetrics);
  const bottlenecks = latestScores
    ? buildBottlenecks(latestCompletedBaseline?.title, latestScores)
    : [];

  const dashboard: OrganizationDashboard = {
    organization: {
      id: membership.organization.id,
      name: membership.organization.name,
      tradeName:
        membership.organization.tradeName ?? membership.organization.name,
      industry: membership.organization.industry ?? "Nao informado",
    },
    connection: {
      status: latestScores ? "connected" : "disconnected",
      lastUpdatedLabel:
        latestCompletedBaseline?.completedAt
          ? `em ${latestCompletedBaseline.completedAt.toLocaleDateString("pt-BR")}`
          : "baseline necessario",
      refreshIntervalSeconds: 0,
    },
    health: latestScores
      ? {
          score: latestScores.generalScore,
          status: latestScores.healthClassification,
          trend: "stable",
          change: 0,
        }
      : null,
    bottlenecks,
    headlineMetrics,
    recentSignals: [],
    actionPlans: [],
  };

  return {
    status: "found",
    dashboard,
  };
}

function buildHeadlineMetrics(
  metrics: Array<typeof manualMetrics.$inferSelect>,
): OrganizationDashboard["headlineMetrics"] {
  const latestByMetricKey = new Map<string, (typeof metrics)[number]>();

  for (const metric of metrics) {
    if (!latestByMetricKey.has(metric.metricKey)) {
      latestByMetricKey.set(metric.metricKey, metric);
    }
  }

  return Array.from(latestByMetricKey.values())
    .slice(0, 6)
    .map((metric) => ({
      id: metric.id,
      label: metric.metricLabel,
      value: formatMetricValue(metric.value, metric.unit),
      change: "Sem historico",
      trend: "stable",
      context: `${metric.category} - ${metric.referenceDate.toLocaleDateString("pt-BR")}`,
    }));
}

function buildBottlenecks(
  baselineTitle: string | null | undefined,
  scores: BaselineDiagnosticScoresSummary,
): OrganizationDashboard["bottlenecks"] {
  return [...scores.scores]
    .sort((left, right) => left.score - right.score)
    .map((area, index) => ({
      rank: index + 1,
      slug: area.areaSlug,
      areaName: area.areaName,
      score: area.score,
      status:
        area.score < 5 ? "critical" : area.score < 7.5 ? "attention" : "healthy",
      trend: "stable",
      change: 0,
      impact: index < 2 ? "high" : index < 4 ? "medium" : "low",
      summary: `Score calculado pela aplicacao ${baselineTitle ?? "mais recente"} do baseline organizacional.`,
      recommendation:
        "Use este resultado como referencia ate que metricas operacionais estejam disponiveis.",
      metrics: [],
      signals: [],
      history: [{ label: "Atual", score: area.score }],
    }));
}

function formatMetricValue(value: number, unit: string | null): string {
  const formattedValue = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);

  return unit ? `${formattedValue} ${unit}` : formattedValue;
}
