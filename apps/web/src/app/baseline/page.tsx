import { requireSession } from "@/features/auth/server/session";
import { BaselineOverview } from "@/features/baseline-diagnostics/components/baseline-overview";

export default async function BaselinePage() { await requireSession("/baseline"); return <BaselineOverview />; }
