import type { Company } from "@/features/companies/types/company-types";

export type HealthStatus = "critical" | "attention" | "healthy";
export type ActionPlanStatus = "not_started" | "in_progress" | "completed";

export type AreaScore = {
  areaId: string;
  areaName: string;
  areaSlug: string;
  score: number;
};

export type CompanyDashboard = {
  company: Pick<Company, "id" | "name" | "tradeName" | "industry">;
  diagnostics: {
    total: number;
    completed: number;
    draft: number;
    latestCompleted: {
      id: string;
      title: string | null;
      status: "draft" | "completed";
      createdAt: string;
      completedAt: string | null;
    } | null;
    latestDraft: {
      id: string;
      title: string | null;
      status: "draft" | "completed";
      createdAt: string;
      completedAt: string | null;
    } | null;
  };
  latestScores: {
    diagnosticId: string;
    generalScore: number;
    healthClassification: HealthStatus;
    mainBottleneck: AreaScore;
    secondPriority: AreaScore | null;
    scores: AreaScore[];
  } | null;
  healthClassification: HealthStatus | null;
  actionPlans: {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    recent: Array<{
      id: string;
      title: string;
      responsible: string | null;
      dueDate: string | null;
      status: ActionPlanStatus;
    }>;
  };
};

export type CompanyPortfolioItem = {
  company: Company;
  dashboard: CompanyDashboard | null;
};
