import { requireSession } from "@/features/auth/server/session";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getOrganizationDashboardSnapshot } from "@/features/dashboard/services/organization-dashboard-service";

export default async function DashboardPage() {
  await requireSession("/dashboard");

  const snapshot = await getOrganizationDashboardSnapshot();
  return <DashboardOverview snapshot={snapshot} />;
}
