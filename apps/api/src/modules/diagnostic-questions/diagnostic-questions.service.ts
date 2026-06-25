import { asc, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  diagnosticAreas,
  diagnosticQuestions,
} from "../../database/schema/index.js";
import type {
  DiagnosticAreasWithQuestions,
  DiagnosticQuestion,
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
