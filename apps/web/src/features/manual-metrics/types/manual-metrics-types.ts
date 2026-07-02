export const manualMetricCategories = [
  "marketing",
  "sales",
  "finance",
  "operations",
  "customer_service",
  "hr",
  "management",
] as const;

export type ManualMetricCategory = (typeof manualMetricCategories)[number];

export type ManualMetric = {
  id: string;
  organizationId: string;
  createdByUserId: string;
  category: ManualMetricCategory;
  metricKey: string;
  metricLabel: string;
  value: number;
  unit: string | null;
  referenceDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ManualMetricInput = {
  category: ManualMetricCategory;
  metricKey: string;
  metricLabel: string;
  value: number;
  unit: string | null;
  referenceDate: string;
  notes: string | null;
};

export const manualMetricCategoryLabels: Record<ManualMetricCategory, string> = {
  marketing: "Marketing",
  sales: "Sales",
  finance: "Financeiro",
  operations: "Operacoes",
  customer_service: "Atendimento",
  hr: "RH",
  management: "Gestao",
};
