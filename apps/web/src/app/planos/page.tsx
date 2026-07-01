import { ActionPlansOverview } from "@/features/action-plans/components/action-plans-overview";
import { requireSession } from "@/features/auth/server/session";

export default async function PlansPage() { await requireSession("/planos"); return <ActionPlansOverview />; }
