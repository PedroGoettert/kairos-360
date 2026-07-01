import { requireSession } from "@/features/auth/server/session";
import { ReportsOverview } from "@/features/reports/components/reports-overview";

export default async function ReportsPage() { await requireSession("/relatorios"); return <ReportsOverview />; }
