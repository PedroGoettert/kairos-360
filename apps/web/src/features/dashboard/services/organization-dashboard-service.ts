import type { OrganizationDashboardSnapshot } from "@/features/dashboard/types/organization-dashboard-types";
import { ServerApiError, getFromApi } from "@/lib/server-api";

export async function getOrganizationDashboardSnapshot(): Promise<OrganizationDashboardSnapshot | null> {
  try {
    return await getFromApi<OrganizationDashboardSnapshot>("/organization/dashboard");
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
