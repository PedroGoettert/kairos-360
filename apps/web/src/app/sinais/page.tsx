import { requireSession } from "@/features/auth/server/session";
import { SignalsOverview } from "@/features/dashboard/components/signals-overview";

export default async function SignalsPage() { await requireSession("/sinais"); return <SignalsOverview />; }
