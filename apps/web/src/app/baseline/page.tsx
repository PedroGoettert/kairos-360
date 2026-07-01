import { requireSession } from "@/features/auth/server/session";
import { BaselineOverview } from "@/features/baseline-diagnostics/components/baseline-overview";
import { getBaselineAreas, getBaselineDiagnostics, getBaselineScores } from "@/features/baseline-diagnostics/services/baseline-server-service";

export default async function BaselinePage() {
  await requireSession("/baseline");
  const [areas, diagnostics] = await Promise.all([getBaselineAreas(), getBaselineDiagnostics()]);
  const latestCompleted = diagnostics.find((diagnostic) => diagnostic.status === "completed");
  const latestScores = latestCompleted ? await getBaselineScores(latestCompleted.id) : null;
  return <BaselineOverview areas={areas} diagnostics={diagnostics} latestScores={latestScores} />;
}
