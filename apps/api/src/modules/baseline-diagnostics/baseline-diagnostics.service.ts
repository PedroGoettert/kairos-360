import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  baselineDiagnosticAnswers,
  baselineDiagnostics,
  baselineDiagnosticScores,
  organizationBaselineAreas,
  organizationBaselineQuestions,
} from "../../database/schema/index.js";
import { getCurrentOrganizationMembership } from "../organizations/organizations.service.js";
import type {
  BaselineDiagnostic,
  BaselineDiagnosticAnswersList,
  BaselineDiagnosticHealthClassification,
  BaselineDiagnosticScoresSummary,
  BaselineDiagnosticsList,
  CompleteBaselineDiagnosticResult,
  CreateBaselineDiagnosticAnswerInput,
  CreateBaselineDiagnosticAnswerResult,
  CreateBaselineDiagnosticInput,
  CreateBaselineDiagnosticResult,
  DeleteBaselineDiagnosticAnswerResult,
  GetBaselineDiagnosticScoresResult,
  UpdateBaselineDiagnosticAnswerInput,
  UpdateBaselineDiagnosticAnswerResult,
} from "./baseline-diagnostics.types.js";

export async function createBaselineDiagnostic(
  currentUserId: string,
  input: CreateBaselineDiagnosticInput,
): Promise<CreateBaselineDiagnosticResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  const [configuredArea] = await db
    .select({ id: organizationBaselineAreas.id })
    .from(organizationBaselineAreas)
    .where(
      and(
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
        eq(organizationBaselineAreas.isActive, true),
      ),
    )
    .limit(1);

  if (!configuredArea) {
    return { status: "baseline_not_configured" };
  }

  const [diagnostic] = await db
    .insert(baselineDiagnostics)
    .values({
      organizationId: membership.organization.id,
      createdByUserId: currentUserId,
      title: input.title,
      notes: input.notes,
    })
    .returning();

  if (!diagnostic) {
    throw new Error("Baseline diagnostic creation failed");
  }

  return { status: "created", diagnostic };
}

export async function listBaselineDiagnosticsByOrganization(
  currentUserId: string,
): Promise<BaselineDiagnosticsList | null> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return null;
  }

  return db
    .select()
    .from(baselineDiagnostics)
    .where(eq(baselineDiagnostics.organizationId, membership.organization.id))
    .orderBy(desc(baselineDiagnostics.createdAt));
}

export async function getBaselineDiagnosticById(
  currentUserId: string,
  diagnosticId: string,
): Promise<BaselineDiagnostic | null> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return null;
  }

  const [diagnostic] = await db
    .select({
      id: baselineDiagnostics.id,
      organizationId: baselineDiagnostics.organizationId,
      createdByUserId: baselineDiagnostics.createdByUserId,
      title: baselineDiagnostics.title,
      notes: baselineDiagnostics.notes,
      status: baselineDiagnostics.status,
      completedAt: baselineDiagnostics.completedAt,
      createdAt: baselineDiagnostics.createdAt,
      updatedAt: baselineDiagnostics.updatedAt,
    })
    .from(baselineDiagnostics)
    .where(
      and(
        eq(baselineDiagnostics.id, diagnosticId),
        eq(baselineDiagnostics.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  return diagnostic ?? null;
}

export async function createBaselineDiagnosticAnswer(
  currentUserId: string,
  diagnosticId: string,
  input: CreateBaselineDiagnosticAnswerInput,
): Promise<CreateBaselineDiagnosticAnswerResult> {
  const diagnostic = await getBaselineDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  if (diagnostic.status === "completed") {
    return { status: "diagnostic_completed" };
  }

  const [question] = await db
    .select({ id: organizationBaselineQuestions.id })
    .from(organizationBaselineQuestions)
    .innerJoin(
      organizationBaselineAreas,
      eq(
        organizationBaselineQuestions.organizationAreaId,
        organizationBaselineAreas.id,
      ),
    )
    .where(
      and(
        eq(organizationBaselineQuestions.id, input.questionId),
        eq(organizationBaselineQuestions.isActive, true),
        eq(organizationBaselineAreas.organizationId, diagnostic.organizationId),
        eq(organizationBaselineAreas.isActive, true),
      ),
    )
    .limit(1);

  if (!question) {
    return { status: "question_not_found" };
  }

  const [existingAnswer] = await db
    .select({ id: baselineDiagnosticAnswers.id })
    .from(baselineDiagnosticAnswers)
    .where(
      and(
        eq(baselineDiagnosticAnswers.diagnosticId, diagnosticId),
        eq(baselineDiagnosticAnswers.questionId, input.questionId),
      ),
    )
    .limit(1);

  if (existingAnswer) {
    return { status: "answer_already_exists" };
  }

  const [answer] = await db
    .insert(baselineDiagnosticAnswers)
    .values({
      diagnosticId,
      questionId: input.questionId,
      score: input.score,
      comment: input.comment,
    })
    .returning();

  if (!answer) {
    throw new Error("Baseline diagnostic answer creation failed");
  }

  return { status: "created", answer };
}

export async function listBaselineDiagnosticAnswers(
  currentUserId: string,
  diagnosticId: string,
): Promise<BaselineDiagnosticAnswersList | null> {
  const diagnostic = await getBaselineDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return null;
  }

  const rows = await db
    .select({
      id: baselineDiagnosticAnswers.id,
      diagnosticId: baselineDiagnosticAnswers.diagnosticId,
      questionId: baselineDiagnosticAnswers.questionId,
      score: baselineDiagnosticAnswers.score,
      comment: baselineDiagnosticAnswers.comment,
      createdAt: baselineDiagnosticAnswers.createdAt,
      updatedAt: baselineDiagnosticAnswers.updatedAt,
      question: {
        id: organizationBaselineQuestions.id,
        areaId: organizationBaselineQuestions.organizationAreaId,
        question: organizationBaselineQuestions.question,
        description: organizationBaselineQuestions.description,
        displayOrder: organizationBaselineQuestions.displayOrder,
      },
      area: {
        id: organizationBaselineAreas.id,
        name: organizationBaselineAreas.name,
        slug: organizationBaselineAreas.slug,
        displayOrder: organizationBaselineAreas.displayOrder,
      },
    })
    .from(baselineDiagnosticAnswers)
    .innerJoin(
      organizationBaselineQuestions,
      eq(
        baselineDiagnosticAnswers.questionId,
        organizationBaselineQuestions.id,
      ),
    )
    .innerJoin(
      organizationBaselineAreas,
      eq(
        organizationBaselineQuestions.organizationAreaId,
        organizationBaselineAreas.id,
      ),
    )
    .where(eq(baselineDiagnosticAnswers.diagnosticId, diagnosticId))
    .orderBy(
      asc(organizationBaselineAreas.displayOrder),
      asc(organizationBaselineQuestions.displayOrder),
    );

  return rows.map(({ area, question, ...answer }) => ({
    ...answer,
    question: {
      ...question,
      area,
    },
  }));
}

export async function updateBaselineDiagnosticAnswer(
  currentUserId: string,
  answerId: string,
  input: UpdateBaselineDiagnosticAnswerInput,
): Promise<UpdateBaselineDiagnosticAnswerResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "answer_not_found" };
  }

  const [answerWithDiagnostic] = await db
    .select({
      id: baselineDiagnosticAnswers.id,
      status: baselineDiagnostics.status,
    })
    .from(baselineDiagnosticAnswers)
    .innerJoin(
      baselineDiagnostics,
      eq(baselineDiagnosticAnswers.diagnosticId, baselineDiagnostics.id),
    )
    .where(
      and(
        eq(baselineDiagnosticAnswers.id, answerId),
        eq(baselineDiagnostics.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!answerWithDiagnostic) {
    return { status: "answer_not_found" };
  }

  if (answerWithDiagnostic.status === "completed") {
    return { status: "diagnostic_completed" };
  }

  const [answer] = await db
    .update(baselineDiagnosticAnswers)
    .set(input)
    .where(eq(baselineDiagnosticAnswers.id, answerId))
    .returning();

  if (!answer) {
    throw new Error("Baseline diagnostic answer update failed");
  }

  return { status: "updated", answer };
}

export async function deleteBaselineDiagnosticAnswer(
  currentUserId: string,
  answerId: string,
): Promise<DeleteBaselineDiagnosticAnswerResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "answer_not_found" };
  }

  const [answerWithDiagnostic] = await db
    .select({
      id: baselineDiagnosticAnswers.id,
      status: baselineDiagnostics.status,
    })
    .from(baselineDiagnosticAnswers)
    .innerJoin(
      baselineDiagnostics,
      eq(baselineDiagnosticAnswers.diagnosticId, baselineDiagnostics.id),
    )
    .where(
      and(
        eq(baselineDiagnosticAnswers.id, answerId),
        eq(baselineDiagnostics.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!answerWithDiagnostic) {
    return { status: "answer_not_found" };
  }

  if (answerWithDiagnostic.status === "completed") {
    return { status: "diagnostic_completed" };
  }

  const [answer] = await db
    .delete(baselineDiagnosticAnswers)
    .where(eq(baselineDiagnosticAnswers.id, answerId))
    .returning();

  if (!answer) {
    throw new Error("Baseline diagnostic answer deletion failed");
  }

  return { status: "deleted", answer };
}

export async function completeBaselineDiagnostic(
  currentUserId: string,
  diagnosticId: string,
): Promise<CompleteBaselineDiagnosticResult> {
  const diagnostic = await getBaselineDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  if (diagnostic.status === "completed") {
    return { status: "diagnostic_completed" };
  }

  const scoreInputs = await getBaselineDiagnosticScoreInputs(diagnosticId);

  if (scoreInputs.length === 0) {
    return { status: "insufficient_answers" };
  }

  const areaScores = calculateAreaScores(scoreInputs);
  const summary = buildScoresSummary(diagnosticId, areaScores);

  await db.transaction(async (tx) => {
    await tx
      .delete(baselineDiagnosticScores)
      .where(eq(baselineDiagnosticScores.diagnosticId, diagnosticId));

    await tx.insert(baselineDiagnosticScores).values(
      areaScores.map((areaScore) => ({
        diagnosticId,
        areaId: areaScore.areaId,
        score: areaScore.score,
      })),
    );

    await tx
      .update(baselineDiagnostics)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(baselineDiagnostics.id, diagnosticId));
  });

  return { status: "completed", summary };
}

export async function getBaselineDiagnosticScores(
  currentUserId: string,
  diagnosticId: string,
): Promise<GetBaselineDiagnosticScoresResult> {
  const diagnostic = await getBaselineDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  const scores = await db
    .select({
      areaId: baselineDiagnosticScores.areaId,
      areaName: organizationBaselineAreas.name,
      areaSlug: organizationBaselineAreas.slug,
      areaDisplayOrder: organizationBaselineAreas.displayOrder,
      score: baselineDiagnosticScores.score,
    })
    .from(baselineDiagnosticScores)
    .innerJoin(
      organizationBaselineAreas,
      eq(baselineDiagnosticScores.areaId, organizationBaselineAreas.id),
    )
    .where(eq(baselineDiagnosticScores.diagnosticId, diagnosticId))
    .orderBy(asc(organizationBaselineAreas.displayOrder));

  if (scores.length === 0) {
    return { status: "diagnostic_not_completed" };
  }

  return {
    status: "found",
    summary: buildScoresSummary(diagnosticId, scores),
  };
}

type BaselineDiagnosticScoreInput = {
  areaId: string;
  areaName: string;
  areaSlug: string;
  areaDisplayOrder: number;
  score: number;
};

type BaselineDiagnosticAreaScore = {
  areaId: string;
  areaName: string;
  areaSlug: string;
  areaDisplayOrder: number;
  score: number;
};

async function getBaselineDiagnosticScoreInputs(
  diagnosticId: string,
): Promise<Array<BaselineDiagnosticScoreInput>> {
  return db
    .select({
      areaId: organizationBaselineAreas.id,
      areaName: organizationBaselineAreas.name,
      areaSlug: organizationBaselineAreas.slug,
      areaDisplayOrder: organizationBaselineAreas.displayOrder,
      score: baselineDiagnosticAnswers.score,
    })
    .from(baselineDiagnosticAnswers)
    .innerJoin(
      organizationBaselineQuestions,
      eq(
        baselineDiagnosticAnswers.questionId,
        organizationBaselineQuestions.id,
      ),
    )
    .innerJoin(
      organizationBaselineAreas,
      eq(
        organizationBaselineQuestions.organizationAreaId,
        organizationBaselineAreas.id,
      ),
    )
    .where(eq(baselineDiagnosticAnswers.diagnosticId, diagnosticId));
}

function calculateAreaScores(
  scoreInputs: Array<BaselineDiagnosticScoreInput>,
): Array<BaselineDiagnosticAreaScore> {
  const groupedScores = scoreInputs.reduce<
    Map<
      string,
      {
        areaName: string;
        areaSlug: string;
        areaDisplayOrder: number;
        total: number;
        count: number;
      }
    >
  >((groups, scoreInput) => {
    const group = groups.get(scoreInput.areaId) ?? {
      areaName: scoreInput.areaName,
      areaSlug: scoreInput.areaSlug,
      areaDisplayOrder: scoreInput.areaDisplayOrder,
      total: 0,
      count: 0,
    };

    group.total += scoreInput.score;
    group.count += 1;
    groups.set(scoreInput.areaId, group);

    return groups;
  }, new Map());

  return Array.from(groupedScores.entries())
    .map(([areaId, group]) => ({
      areaId,
      areaName: group.areaName,
      areaSlug: group.areaSlug,
      areaDisplayOrder: group.areaDisplayOrder,
      score: roundScore(group.total / group.count),
    }))
    .sort((left, right) => left.areaDisplayOrder - right.areaDisplayOrder);
}

function buildScoresSummary(
  diagnosticId: string,
  areaScores: Array<BaselineDiagnosticAreaScore>,
): BaselineDiagnosticScoresSummary {
  const scoresByPriority = [...areaScores].sort((left, right) => {
    if (left.score !== right.score) {
      return left.score - right.score;
    }

    return left.areaDisplayOrder - right.areaDisplayOrder;
  });
  const mainBottleneck = scoresByPriority[0];

  if (!mainBottleneck) {
    throw new Error(
      "Cannot build baseline diagnostic scores summary without scores",
    );
  }

  const generalScore = roundScore(
    areaScores.reduce((total, areaScore) => total + areaScore.score, 0) /
      areaScores.length,
  );

  return {
    diagnosticId,
    generalScore,
    healthClassification: classifyHealth(generalScore),
    mainBottleneck: toPublicAreaScore(mainBottleneck),
    secondPriority: scoresByPriority[1]
      ? toPublicAreaScore(scoresByPriority[1])
      : null,
    scores: areaScores.map(toPublicAreaScore),
  };
}

function toPublicAreaScore(areaScore: BaselineDiagnosticAreaScore) {
  return {
    areaId: areaScore.areaId,
    areaName: areaScore.areaName,
    areaSlug: areaScore.areaSlug,
    score: areaScore.score,
  };
}

function classifyHealth(
  score: number,
): BaselineDiagnosticHealthClassification {
  if (score <= 4.9) {
    return "critical";
  }

  if (score <= 7.4) {
    return "attention";
  }

  return "healthy";
}

function roundScore(score: number): number {
  return Number(score.toFixed(2));
}
