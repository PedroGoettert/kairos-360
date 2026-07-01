export type HealthStatus = "critical" | "attention" | "healthy";
export type TrendDirection = "declining" | "stable" | "improving";
export type SignalSeverity = "critical" | "warning" | "info";
export type PlanStatus = "not_started" | "in_progress" | "completed";

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  context: string;
};

export type DashboardSignal = {
  id: string;
  title: string;
  description: string;
  severity: SignalSeverity;
  detectedAt: string;
};

export type ScoreHistoryPoint = {
  label: string;
  score: number;
};

export type Bottleneck = {
  rank: number;
  slug: string;
  areaName: string;
  score: number;
  status: HealthStatus;
  trend: TrendDirection;
  change: number;
  impact: "high" | "medium" | "low";
  summary: string;
  recommendation: string;
  metrics: DashboardMetric[];
  signals: DashboardSignal[];
  history: ScoreHistoryPoint[];
};

export type DashboardActionPlan = {
  id: string;
  areaSlug: string;
  title: string;
  responsible: string;
  dueDate: string;
  status: PlanStatus;
  progress: number;
};

export type OrganizationDashboardSnapshot = {
  organization: {
    id: string;
    name: string;
    tradeName: string;
    industry: string;
  };
  connection: {
    status: "connected" | "updating" | "disconnected";
    lastUpdatedLabel: string;
    refreshIntervalSeconds: number;
  };
  health: {
    score: number;
    status: HealthStatus;
    trend: TrendDirection;
    change: number;
  };
  bottlenecks: Bottleneck[];
  headlineMetrics: DashboardMetric[];
  recentSignals: DashboardSignal[];
  actionPlans: DashboardActionPlan[];
};
