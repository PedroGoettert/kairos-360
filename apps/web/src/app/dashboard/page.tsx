import { requireSession } from "@/features/auth/server/session";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default async function DashboardPage() {
  await requireSession("/dashboard");

  return <DashboardOverview />;
}
