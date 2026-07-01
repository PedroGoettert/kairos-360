import { requireSession } from "@/features/auth/server/session";
import { MetricsOverview } from "@/features/dashboard/components/metrics-overview";

export default async function MetricsPage() { await requireSession("/metricas"); return <MetricsOverview />; }
