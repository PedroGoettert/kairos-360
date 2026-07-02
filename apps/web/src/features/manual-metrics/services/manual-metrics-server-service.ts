import { getFromApi, ServerApiError } from "@/lib/server-api";
import type { ManualMetric } from "@/features/manual-metrics/types/manual-metrics-types";

export async function getOrganizationManualMetrics(): Promise<ManualMetric[]> {
  try {
    return await getFromApi<ManualMetric[]>("/organization/manual-metrics");
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) {
      return [];
    }

    throw error;
  }
}
