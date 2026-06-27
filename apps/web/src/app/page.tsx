import { requireSession } from "@/features/auth/server/session";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardPageData } from "@/features/dashboard/services/dashboard-page-service";

export default async function Home() {
  await requireSession("/");

  try {
    const data = await getDashboardPageData();
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
