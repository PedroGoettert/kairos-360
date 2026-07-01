import type { HealthStatus } from "@/features/dashboard/types/organization-dashboard-types";

export type BaselineQuestion = { id: string; organizationAreaId: string; question: string; description: string | null; displayOrder: number; isActive: boolean };
export type BaselineArea = { id: string; organizationId: string; templateAreaId: string | null; name: string; slug: string; description: string | null; displayOrder: number; isActive: boolean; questions: BaselineQuestion[] };
export type BaselineDiagnostic = { id: string; organizationId: string; createdByUserId: string; title: string | null; notes: string | null; status: "draft" | "completed"; completedAt: string | null; createdAt: string; updatedAt: string };
export type BaselineAnswer = { id: string; diagnosticId: string; questionId: string; score: number; comment: string | null; createdAt: string; updatedAt: string; question: { id: string; areaId: string; question: string; description: string | null; displayOrder: number; area: { id: string; name: string; slug: string; displayOrder: number } } };
export type BaselineAreaScore = { areaId: string; areaName: string; areaSlug: string; score: number };
export type BaselineScores = { diagnosticId: string; generalScore: number; healthClassification: HealthStatus; mainBottleneck: BaselineAreaScore; secondPriority: BaselineAreaScore | null; scores: BaselineAreaScore[] };
