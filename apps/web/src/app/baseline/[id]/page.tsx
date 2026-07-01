import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/server/session";
import { BaselineAssessment } from "@/features/baseline-diagnostics/components/baseline-assessment";
import { getBaselineAnswers, getBaselineAreas, getBaselineDiagnostic, getBaselineScores } from "@/features/baseline-diagnostics/services/baseline-server-service";

type Props = { params: Promise<{ id: string }> };
export default async function BaselineAssessmentPage({ params }: Props) {
  const { id } = await params; await requireSession(`/baseline/${id}`);
  const [diagnostic, areas, answers] = await Promise.all([getBaselineDiagnostic(id), getBaselineAreas(), getBaselineAnswers(id)]);
  if (!diagnostic) notFound();
  const scores = diagnostic.status === "completed" ? await getBaselineScores(id) : null;
  return <BaselineAssessment diagnostic={diagnostic} areas={areas} answers={answers} scores={scores} />;
}
