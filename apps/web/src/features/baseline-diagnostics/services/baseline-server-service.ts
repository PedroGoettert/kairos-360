import { getFromApi, ServerApiError } from "@/lib/server-api";
import type { BaselineAnswer, BaselineArea, BaselineDiagnostic, BaselineScores } from "@/features/baseline-diagnostics/types/baseline-types";

function isNotFound(error: unknown): boolean { return error instanceof ServerApiError && error.status === 404; }
export async function getBaselineAreas(): Promise<BaselineArea[]> { try { return await getFromApi<BaselineArea[]>("/organization/baseline-areas"); } catch (error) { if (isNotFound(error)) return []; throw error; } }
export async function getBaselineDiagnostics(): Promise<BaselineDiagnostic[]> { try { return await getFromApi<BaselineDiagnostic[]>("/organization/baseline-diagnostics"); } catch (error) { if (isNotFound(error)) return []; throw error; } }
export async function getBaselineDiagnostic(id: string): Promise<BaselineDiagnostic | null> { try { return await getFromApi<BaselineDiagnostic>(`/baseline-diagnostics/${id}`); } catch (error) { if (isNotFound(error)) return null; throw error; } }
export async function getBaselineAnswers(id: string): Promise<BaselineAnswer[]> { return getFromApi<BaselineAnswer[]>(`/baseline-diagnostics/${id}/answers`); }
export async function getBaselineScores(id: string): Promise<BaselineScores | null> { try { return await getFromApi<BaselineScores>(`/baseline-diagnostics/${id}/scores`); } catch (error) { if (error instanceof ServerApiError && (error.status === 404 || error.status === 409)) return null; throw error; } }
