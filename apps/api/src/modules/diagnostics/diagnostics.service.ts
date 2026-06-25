import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  companies,
  diagnosticAnswers,
  diagnosticAreas,
  diagnosticQuestions,
  diagnosticScores,
  diagnostics,
} from "../../database/schema/index.js";
import { getCompanyById } from "../companies/companies.service.js";
import type {
  CompleteDiagnosticResult,
  CreateDiagnosticAnswerInput,
  CreateDiagnosticAnswerResult,
  DeleteDiagnosticAnswerResult,
  CreateDiagnosticInput,
  Diagnostic,
  DiagnosticAnswersList,
  DiagnosticHealthClassification,
  DiagnosticScoresSummary,
  DiagnosticsList,
  GetDiagnosticScoresResult,
  UpdateDiagnosticAnswerInput,
  UpdateDiagnosticAnswerResult,
} from "./diagnostics.types.js";

export async function createDiagnostic(
  currentUserId: string,
  input: CreateDiagnosticInput,
): Promise<Diagnostic | null> {
  const company = await getCompanyById(currentUserId, input.companyId);

  if (!company) {
    return null;
  }

  const [diagnostic] = await db
    .insert(diagnostics)
    .values({
      companyId: input.companyId,
      createdByUserId: currentUserId,
      title: input.title,
      notes: input.notes,
    })
    .returning();

  if (!diagnostic) {
    throw new Error("Diagnostic creation failed");
  }

  return diagnostic;
}

export async function listDiagnosticsByCompany(
  currentUserId: string,
  companyId: string,
): Promise<DiagnosticsList | null> {
  const company = await getCompanyById(currentUserId, companyId);

  if (!company) {
    return null;
  }

  return db
    .select()
    .from(diagnostics)
    .where(eq(diagnostics.companyId, companyId))
    .orderBy(desc(diagnostics.createdAt));
}

export async function getDiagnosticById(
  currentUserId: string,
  diagnosticId: string,
): Promise<Diagnostic | null> {
  const [diagnostic] = await db
    .select({
      id: diagnostics.id,
      companyId: diagnostics.companyId,
      createdByUserId: diagnostics.createdByUserId,
      title: diagnostics.title,
      notes: diagnostics.notes,
      status: diagnostics.status,
      completedAt: diagnostics.completedAt,
      createdAt: diagnostics.createdAt,
      updatedAt: diagnostics.updatedAt,
    })
    .from(diagnostics)
    .innerJoin(companies, eq(diagnostics.companyId, companies.id))
    .where(
      and(
        eq(diagnostics.id, diagnosticId),
        eq(companies.ownerUserId, currentUserId),
      ),
    )
    .limit(1);

  return diagnostic ?? null;
}

export async function createDiagnosticAnswer(
  currentUserId: string,
  diagnosticId: string,
  input: CreateDiagnosticAnswerInput,
): Promise<CreateDiagnosticAnswerResult> {
  const diagnostic = await getDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  if (diagnostic.status === "completed") {
    return { status: "diagnostic_completed" };
  }

  const [question] = await db
    .select({
      id: diagnosticQuestions.id,
    })
    .from(diagnosticQuestions)
    .where(
      and(
        eq(diagnosticQuestions.id, input.questionId),
        eq(diagnosticQuestions.isActive, true),
      ),
    )
    .limit(1);

  if (!question) {
    return { status: "question_not_found" };
  }

  const [existingAnswer] = await db
    .select({
      id: diagnosticAnswers.id,
    })
    .from(diagnosticAnswers)
    .where(
      and(
        eq(diagnosticAnswers.diagnosticId, diagnosticId),
        eq(diagnosticAnswers.questionId, input.questionId),
      ),
    )
    .limit(1);

  if (existingAnswer) {
    return { status: "answer_already_exists" };
  }

  const [answer] = await db
    .insert(diagnosticAnswers)
    .values({
      diagnosticId,
      questionId: input.questionId,
      score: input.score,
      comment: input.comment,
    })
    .returning();

  if (!answer) {
    throw new Error("Diagnostic answer creation failed");
  }

  return {
    status: "created",
    answer,
  };
}

export async function listDiagnosticAnswers(
  currentUserId: string,
  diagnosticId: string,
): Promise<DiagnosticAnswersList | null> {
  const diagnostic = await getDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return null;
  }

  const rows = await db
    .select({
      id: diagnosticAnswers.id,
      diagnosticId: diagnosticAnswers.diagnosticId,
      questionId: diagnosticAnswers.questionId,
      score: diagnosticAnswers.score,
      comment: diagnosticAnswers.comment,
      createdAt: diagnosticAnswers.createdAt,
      updatedAt: diagnosticAnswers.updatedAt,
      question: {
        id: diagnosticQuestions.id,
        areaId: diagnosticQuestions.areaId,
        question: diagnosticQuestions.question,
        description: diagnosticQuestions.description,
        displayOrder: diagnosticQuestions.displayOrder,
      },
      area: {
        id: diagnosticAreas.id,
        name: diagnosticAreas.name,
        slug: diagnosticAreas.slug,
        displayOrder: diagnosticAreas.displayOrder,
      },
    })
    .from(diagnosticAnswers)
    .innerJoin(
      diagnosticQuestions,
      eq(diagnosticAnswers.questionId, diagnosticQuestions.id),
    )
    .innerJoin(diagnosticAreas, eq(diagnosticQuestions.areaId, diagnosticAreas.id))
    .where(eq(diagnosticAnswers.diagnosticId, diagnosticId))
    .orderBy(asc(diagnosticAreas.displayOrder), asc(diagnosticQuestions.displayOrder));

  return rows.map(({ area, question, ...answer }) => ({
    ...answer,
    question: {
      ...question,
      area,
    },
  }));
}

export async function updateDiagnosticAnswer(
  currentUserId: string,
  answerId: string,
  input: UpdateDiagnosticAnswerInput,
): Promise<UpdateDiagnosticAnswerResult> {
  const [answerWithDiagnostic] = await db
    .select({
      id: diagnosticAnswers.id,
      diagnosticId: diagnosticAnswers.diagnosticId,
      status: diagnostics.status,
    })
    .from(diagnosticAnswers)
    .innerJoin(diagnostics, eq(diagnosticAnswers.diagnosticId, diagnostics.id))
    .innerJoin(companies, eq(diagnostics.companyId, companies.id))
    .where(
      and(
        eq(diagnosticAnswers.id, answerId),
        eq(companies.ownerUserId, currentUserId),
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
    .update(diagnosticAnswers)
    .set(input)
    .where(eq(diagnosticAnswers.id, answerId))
    .returning();

  if (!answer) {
    throw new Error("Diagnostic answer update failed");
  }

  return {
    status: "updated",
    answer,
  };
}

export async function deleteDiagnosticAnswer(
  currentUserId: string,
  answerId: string,
): Promise<DeleteDiagnosticAnswerResult> {
  const [answerWithDiagnostic] = await db
    .select({
      id: diagnosticAnswers.id,
      status: diagnostics.status,
    })
    .from(diagnosticAnswers)
    .innerJoin(diagnostics, eq(diagnosticAnswers.diagnosticId, diagnostics.id))
    .innerJoin(companies, eq(diagnostics.companyId, companies.id))
    .where(
      and(
        eq(diagnosticAnswers.id, answerId),
        eq(companies.ownerUserId, currentUserId),
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
    .delete(diagnosticAnswers)
    .where(eq(diagnosticAnswers.id, answerId))
    .returning();

  if (!answer) {
    throw new Error("Diagnostic answer deletion failed");
  }

  return {
    status: "deleted",
    answer,
  };
}

export async function completeDiagnostic(
  currentUserId: string,
  diagnosticId: string,
): Promise<CompleteDiagnosticResult> {
  const diagnostic = await getDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  if (diagnostic.status === "completed") {
    return { status: "diagnostic_completed" };
  }

  const scoreInputs = await getDiagnosticScoreInputs(diagnosticId);

  if (scoreInputs.length === 0) {
    return { status: "insufficient_answers" };
  }

  const areaScores = calculateAreaScores(scoreInputs);
  const summary = buildScoresSummary(diagnosticId, areaScores);

  await db.transaction(async (tx) => {
    await tx
      .delete(diagnosticScores)
      .where(eq(diagnosticScores.diagnosticId, diagnosticId));

    await tx.insert(diagnosticScores).values(
      areaScores.map((areaScore) => ({
        diagnosticId,
        areaId: areaScore.areaId,
        score: areaScore.score,
      })),
    );

    await tx
      .update(diagnostics)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(diagnostics.id, diagnosticId));
  });

  return {
    status: "completed",
    summary,
  };
}

export async function getDiagnosticScores(
  currentUserId: string,
  diagnosticId: string,
): Promise<GetDiagnosticScoresResult> {
  const diagnostic = await getDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  const scores = await db
    .select({
      areaId: diagnosticScores.areaId,
      areaName: diagnosticAreas.name,
      areaSlug: diagnosticAreas.slug,
      areaDisplayOrder: diagnosticAreas.displayOrder,
      score: diagnosticScores.score,
    })
    .from(diagnosticScores)
    .innerJoin(diagnosticAreas, eq(diagnosticScores.areaId, diagnosticAreas.id))
    .where(eq(diagnosticScores.diagnosticId, diagnosticId))
    .orderBy(asc(diagnosticAreas.displayOrder));

  if (scores.length === 0) {
    return { status: "diagnostic_not_completed" };
  }

  return {
    status: "found",
    summary: buildScoresSummary(diagnosticId, scores),
  };
}

type DiagnosticScoreInput = {
  areaId: string;
  areaName: string;
  areaSlug: string;
  areaDisplayOrder: number;
  score: number;
};

type DiagnosticAreaScore = {
  areaId: string;
  areaName: string;
  areaSlug: string;
  areaDisplayOrder: number;
  score: number;
};

async function getDiagnosticScoreInputs(
  diagnosticId: string,
): Promise<Array<DiagnosticScoreInput>> {
  return db
    .select({
      areaId: diagnosticAreas.id,
      areaName: diagnosticAreas.name,
      areaSlug: diagnosticAreas.slug,
      areaDisplayOrder: diagnosticAreas.displayOrder,
      score: diagnosticAnswers.score,
    })
    .from(diagnosticAnswers)
    .innerJoin(
      diagnosticQuestions,
      eq(diagnosticAnswers.questionId, diagnosticQuestions.id),
    )
    .innerJoin(diagnosticAreas, eq(diagnosticQuestions.areaId, diagnosticAreas.id))
    .where(eq(diagnosticAnswers.diagnosticId, diagnosticId));
}

function calculateAreaScores(
  scoreInputs: Array<DiagnosticScoreInput>,
): Array<DiagnosticAreaScore> {
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
  areaScores: Array<DiagnosticAreaScore>,
): DiagnosticScoresSummary {
  const scoresByPriority = [...areaScores].sort((left, right) => {
    if (left.score !== right.score) {
      return left.score - right.score;
    }

    return left.areaDisplayOrder - right.areaDisplayOrder;
  });
  const mainBottleneck = scoresByPriority[0];

  if (!mainBottleneck) {
    throw new Error("Cannot build diagnostic scores summary without scores");
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

function toPublicAreaScore(areaScore: DiagnosticAreaScore) {
  return {
    areaId: areaScore.areaId,
    areaName: areaScore.areaName,
    areaSlug: areaScore.areaSlug,
    score: areaScore.score,
  };
}

function classifyHealth(score: number): DiagnosticHealthClassification {
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
