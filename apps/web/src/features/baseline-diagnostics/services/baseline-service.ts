import { requestApi } from "@/lib/client-api";
import type { BaselineAnswer, BaselineDiagnostic, BaselineScores } from "@/features/baseline-diagnostics/types/baseline-types";

export function createBaseline(title: string | null) { return requestApi<BaselineDiagnostic>("/baseline-diagnostics", { method: "POST", body: JSON.stringify({ title }) }); }
export function createBaselineAnswer(diagnosticId: string, questionId: string, score: number) { return requestApi<BaselineAnswer>(`/baseline-diagnostics/${diagnosticId}/answers`, { method: "POST", body: JSON.stringify({ questionId, score }) }); }
export function updateBaselineAnswer(answerId: string, score: number) { return requestApi<BaselineAnswer>(`/baseline-diagnostic-answers/${answerId}`, { method: "PATCH", body: JSON.stringify({ score }) }); }
export function completeBaseline(id: string) { return requestApi<BaselineScores>(`/baseline-diagnostics/${id}/complete`, { method: "POST" }); }
