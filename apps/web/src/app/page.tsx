import { requireSession } from "@/features/auth/server/session";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default async function Home() {
  await requireSession("/");

  return <DashboardOverview />;
}
