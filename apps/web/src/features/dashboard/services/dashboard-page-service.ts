import { listCompanies } from "@/features/companies/services/company-server-service";
import { getCompanyDashboard } from "@/features/dashboard/services/dashboard-server-service";

export async function getDashboardPageData(companyId?: string) {
  const companies = await listCompanies();
  const selectedCompany =
    companies.find((company) => company.id === companyId) ?? companies[0] ?? null;
  const dashboard = selectedCompany
    ? await getCompanyDashboard(selectedCompany.id)
    : null;

  return { companies, dashboard };
}
