import { requireSession } from "@/features/auth/server/session";
import { ClientsPage } from "@/features/companies/components/clients-page";
import { listCompanies } from "@/features/companies/services/company-server-service";
import { getCompanyDashboard } from "@/features/dashboard/services/dashboard-server-service";

export default async function ClientesPage() {
  await requireSession("/clientes");

  try {
    const companies = await listCompanies();
    const items = await Promise.all(
      companies.map(async (company) => ({
        company,
        dashboard: await getCompanyDashboard(company.id).catch(() => null),
      })),
    );

    return <ClientsPage items={items} />;
  } catch (error) {
    return (
      <ClientsPage
        items={[]}
        loadError={error instanceof Error ? error.message : "Nao foi possivel carregar os clientes."}
      />
    );
  }
}
