import type { CompanyDashboard } from "@/features/dashboard/types/dashboard-types";
import { getFromApi } from "@/lib/server-api";

export async function getCompanyDashboard(
  companyId: string,
): Promise<CompanyDashboard> {
  return getFromApi<CompanyDashboard>(`/companies/${companyId}/dashboard`);
}
