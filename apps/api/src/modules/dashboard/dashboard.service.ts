import { and, desc, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  actionPlans,
  companies,
  diagnostics,
} from "../../database/schema/index.js";
import { getCompanyById } from "../companies/companies.service.js";
import { getDiagnosticScores } from "../diagnostics/diagnostics.service.js";
import type {
  CompanyDashboard,
  GetCompanyDashboardResult,
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
