import { getBaselineDiagnostics, getBaselineScores } from "@/features/baseline-diagnostics/services/baseline-server-service";
import { getCurrentOrganization } from "@/features/organization/services/organization-server-service";
import type { OrganizationDashboardSnapshot } from "@/features/dashboard/types/organization-dashboard-types";

export async function getOrganizationDashboardSnapshot(): Promise<OrganizationDashboardSnapshot | null> {
  const [organization, diagnostics] = await Promise.all([getCurrentOrganization(), getBaselineDiagnostics()]);
  if (!organization) return null;
  const latest = diagnostics.find((diagnostic) => diagnostic.status === "completed");
  if (!latest) return null;
  const scores = await getBaselineScores(latest.id);
  if (!scores) return null;

  const bottlenecks = [...scores.scores].sort((a, b) => a.score - b.score).map((area, index) => ({
    rank: index + 1,
    slug: area.areaSlug,
    areaName: area.areaName,
    score: area.score,
    status: area.score < 5 ? "critical" as const : area.score < 7.5 ? "attention" as const : "healthy" as const,
    trend: "stable" as const,
    change: 0,
    impact: index < 2 ? "high" as const : index < 4 ? "medium" as const : "low" as const,
    summary: `Score calculado pela aplicação ${latest.title ?? "mais recente"} do baseline organizacional.`,
    recommendation: "Use este resultado como referência até que métricas operacionais estejam disponíveis.",
    metrics: [], signals: [], history: [{ label: "Atual", score: area.score }],
  }));

  return {
    organization: { id: organization.id, name: organization.name, tradeName: organization.tradeName ?? organization.name, industry: organization.industry ?? "Não informado" },
    connection: { status: "connected", lastUpdatedLabel: latest.completedAt ? `em ${new Date(latest.completedAt).toLocaleDateString("pt-BR")}` : "no último baseline", refreshIntervalSeconds: 0 },
    health: { score: scores.generalScore, status: scores.healthClassification, trend: "stable", change: 0 },
    bottlenecks, headlineMetrics: [], recentSignals: [], actionPlans: [],
  };
}
