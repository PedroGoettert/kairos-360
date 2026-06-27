import { requireSession } from "@/features/auth/server/session";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardPageData } from "@/features/dashboard/services/dashboard-page-service";

type DashboardPageProps = {
  searchParams?: Promise<{ companyId?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireSession("/dashboard");
  const companyId = (await searchParams)?.companyId;

  try {
    const data = await getDashboardPageData(companyId);
    return <DashboardOverview {...data} />;
  } catch (error) {
    return (
      <DashboardOverview
        companies={[]}
        dashboard={null}
        loadError={error instanceof Error ? error.message : "Nao foi possivel carregar o dashboard."}
      />
    );
  }
}
