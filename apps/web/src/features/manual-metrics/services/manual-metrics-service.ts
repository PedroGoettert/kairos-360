import { requestApi } from "@/lib/client-api";
import type { ManualMetric, ManualMetricInput } from "@/features/manual-metrics/types/manual-metrics-types";

export function listManualMetrics() {
  return requestApi<ManualMetric[]>("/organization/manual-metrics");
}

export function createManualMetric(input: ManualMetricInput) {
  return requestApi<ManualMetric>("/organization/manual-metrics", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateManualMetric(id: string, input: Partial<ManualMetricInput>) {
  return requestApi<ManualMetric>(`/organization/manual-metrics/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteManualMetric(id: string) {
  return requestApi<ManualMetric>(`/organization/manual-metrics/${id}`, {
    method: "DELETE",
  });
}
