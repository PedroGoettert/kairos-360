import { and, asc, desc, eq, ne } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  diagnosticAreas,
  diagnosticQuestions,
} from "../../database/schema/index.js";
import type {
  CreateDiagnosticQuestionInput,
  CreateDiagnosticQuestionResult,
  GetDiagnosticAreaByIdResult,
  DiagnosticAreasWithQuestions,
  DiagnosticQuestion,
  UpdateDiagnosticQuestionInput,
  UpdateDiagnosticQuestionResult,
  UpdateDiagnosticQuestionStatusInput,
} from "./diagnostic-questions.types.js";

export async function listDiagnosticAreasWithQuestions(): Promise<DiagnosticAreasWithQuestions> {
  const areas = await db
    .select({
      id: diagnosticAreas.id,
      name: diagnosticAreas.name,
      slug: diagnosticAreas.slug,
      description: diagnosticAreas.description,
      displayOrder: diagnosticAreas.displayOrder,
    })
    .from(diagnosticAreas)
    .where(eq(diagnosticAreas.isActive, true))
    .orderBy(asc(diagnosticAreas.displayOrder));

  const questions = await db
    .select({
      id: diagnosticQuestions.id,
      areaId: diagnosticQuestions.areaId,
      question: diagnosticQuestions.question,
      description: diagnosticQuestions.description,
      displayOrder: diagnosticQuestions.displayOrder,
    })
    .from(diagnosticQuestions)
    .where(eq(diagnosticQuestions.isActive, true))
    .orderBy(
      asc(diagnosticQuestions.areaId),
      asc(diagnosticQuestions.displayOrder),
    );

  const questionsByAreaId = questions.reduce<
    Map<string, Array<DiagnosticQuestion>>
  >((groupedQuestions, question) => {
    const areaQuestions = groupedQuestions.get(question.areaId) ?? [];
    areaQuestions.push(question);
    groupedQuestions.set(question.areaId, areaQuestions);

    return groupedQuestions;
  }, new Map());

  return areas.map((area) => ({
    ...area,
    questions: questionsByAreaId.get(area.id) ?? [],
  }));
}

export async function getDiagnosticAreaById(
  areaId: string,
): Promise<GetDiagnosticAreaByIdResult> {
  const [area] = await db
    .select({
      id: diagnosticAreas.id,
      name: diagnosticAreas.name,
      slug: diagnosticAreas.slug,
      description: diagnosticAreas.description,
      displayOrder: diagnosticAreas.displayOrder,
    })
    .from(diagnosticAreas)
    .where(and(eq(diagnosticAreas.id, areaId), eq(diagnosticAreas.isActive, true)))
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  const questions = await db
    .select({
      id: diagnosticQuestions.id,
      areaId: diagnosticQuestions.areaId,
      question: diagnosticQuestions.question,
      description: diagnosticQuestions.description,
      displayOrder: diagnosticQuestions.displayOrder,
    })
    .from(diagnosticQuestions)
    .where(
      and(
        eq(diagnosticQuestions.areaId, areaId),
        eq(diagnosticQuestions.isActive, true),
      ),
    )
    .orderBy(asc(diagnosticQuestions.displayOrder));

  return {
    status: "found",
    area: {
      ...area,
      questions,
    },
  };
}

export async function createDiagnosticQuestion(
  areaId: string,
  input: CreateDiagnosticQuestionInput,
): Promise<CreateDiagnosticQuestionResult> {
  const [area] = await db
    .select({
      id: diagnosticAreas.id,
    })
    .from(diagnosticAreas)
    .where(and(eq(diagnosticAreas.id, areaId), eq(diagnosticAreas.isActive, true)))
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  const [existingQuestion] = await db
    .select({
      id: diagnosticQuestions.id,
    })
    .from(diagnosticQuestions)
    .where(
      and(
        eq(diagnosticQuestions.areaId, areaId),
        eq(diagnosticQuestions.question, input.question),
      ),
    )
    .limit(1);

  if (existingQuestion) {
    return { status: "question_already_exists" };
  }

  const displayOrder =
    input.displayOrder ?? (await getNextQuestionDisplayOrder(areaId));

  const [question] = await db
    .insert(diagnosticQuestions)
    .values({
      areaId,
      question: input.question,
      description: input.description,
      displayOrder,
    })
    .returning({
      id: diagnosticQuestions.id,
      areaId: diagnosticQuestions.areaId,
      question: diagnosticQuestions.question,
      description: diagnosticQuestions.description,
      displayOrder: diagnosticQuestions.displayOrder,
      isActive: diagnosticQuestions.isActive,
    });

  if (!question) {
    throw new Error("Diagnostic question creation failed");
  }

  return {
    status: "created",
    question,
  };
}

export async function updateDiagnosticQuestion(
  questionId: string,
  input: UpdateDiagnosticQuestionInput,
): Promise<UpdateDiagnosticQuestionResult> {
  const [existingQuestion] = await db
    .select({
      id: diagnosticQuestions.id,
      areaId: diagnosticQuestions.areaId,
    })
    .from(diagnosticQuestions)
    .where(eq(diagnosticQuestions.id, questionId))
    .limit(1);

  if (!existingQuestion) {
    return { status: "question_not_found" };
  }

  if (input.question !== undefined) {
    const [duplicateQuestion] = await db
      .select({
        id: diagnosticQuestions.id,
      })
      .from(diagnosticQuestions)
      .where(
        and(
          eq(diagnosticQuestions.areaId, existingQuestion.areaId),
          eq(diagnosticQuestions.question, input.question),
          ne(diagnosticQuestions.id, questionId),
        ),
      )
      .limit(1);

    if (duplicateQuestion) {
      return { status: "question_already_exists" };
    }
  }

  const [question] = await db
    .update(diagnosticQuestions)
    .set(input)
    .where(eq(diagnosticQuestions.id, questionId))
    .returning({
      id: diagnosticQuestions.id,
      areaId: diagnosticQuestions.areaId,
      question: diagnosticQuestions.question,
      description: diagnosticQuestions.description,
      displayOrder: diagnosticQuestions.displayOrder,
      isActive: diagnosticQuestions.isActive,
    });

  if (!question) {
    throw new Error("Diagnostic question update failed");
  }

  return {
    status: "updated",
    question,
  };
}

export async function updateDiagnosticQuestionStatus(
  questionId: string,
  input: UpdateDiagnosticQuestionStatusInput,
): Promise<UpdateDiagnosticQuestionResult> {
  const [question] = await db
    .update(diagnosticQuestions)
    .set({
      isActive: input.isActive,
    })
    .where(eq(diagnosticQuestions.id, questionId))
    .returning({
      id: diagnosticQuestions.id,
      areaId: diagnosticQuestions.areaId,
      question: diagnosticQuestions.question,
      description: diagnosticQuestions.description,
      displayOrder: diagnosticQuestions.displayOrder,
      isActive: diagnosticQuestions.isActive,
    });

  if (!question) {
    return { status: "question_not_found" };
  }

  return {
    status: "updated",
    question,
  };
}

async function getNextQuestionDisplayOrder(areaId: string): Promise<number> {
  const [lastQuestion] = await db
    .select({
      displayOrder: diagnosticQuestions.displayOrder,
    })
    .from(diagnosticQuestions)
    .where(eq(diagnosticQuestions.areaId, areaId))
    .orderBy(desc(diagnosticQuestions.displayOrder))
    .limit(1);

  return (lastQuestion?.displayOrder ?? 0) + 1;
}
