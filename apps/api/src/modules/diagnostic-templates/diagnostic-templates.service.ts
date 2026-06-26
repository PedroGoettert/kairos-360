import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  diagnosticTemplateAreas,
  diagnosticTemplateQuestions,
  diagnosticTemplates,
} from "../../database/schema/index.js";
import type {
  CreateDiagnosticTemplateAreaInput,
  CreateDiagnosticTemplateAreaResult,
  CreateDiagnosticTemplateInput,
  CreateDiagnosticTemplateQuestionInput,
  CreateDiagnosticTemplateQuestionResult,
  CreateDiagnosticTemplateResult,
  DiagnosticTemplate,
  DiagnosticTemplateArea,
  DiagnosticTemplateQuestion,
  DiagnosticTemplatesList,
  GetDiagnosticTemplateByIdResult,
} from "./diagnostic-templates.types.js";

export async function listDiagnosticTemplates(): Promise<DiagnosticTemplatesList> {
  return listTemplatesByFilter();
}

export async function getDiagnosticTemplateById(
  templateId: string,
): Promise<GetDiagnosticTemplateByIdResult> {
  const [template] = await listTemplatesByFilter(eq(diagnosticTemplates.id, templateId));

  if (!template) {
    return { status: "template_not_found" };
  }

  return {
    status: "found",
    template,
  };
}

export async function createDiagnosticTemplate(
  input: CreateDiagnosticTemplateInput,
): Promise<CreateDiagnosticTemplateResult> {
  const [existingTemplate] = await db
    .select({
      id: diagnosticTemplates.id,
    })
    .from(diagnosticTemplates)
    .where(eq(diagnosticTemplates.slug, input.slug))
    .limit(1);

  if (existingTemplate) {
    return { status: "template_already_exists" };
  }

  const [templateRow] = await db
    .insert(diagnosticTemplates)
    .values({
      name: input.name,
      slug: input.slug,
      description: input.description,
      isDefault: input.isDefault ?? false,
    })
    .returning();

  if (!templateRow) {
    throw new Error("Diagnostic template creation failed");
  }

  return {
    status: "created",
    template: {
      ...templateRow,
      areas: [],
    },
  };
}

export async function createDiagnosticTemplateArea(
  templateId: string,
  input: CreateDiagnosticTemplateAreaInput,
): Promise<CreateDiagnosticTemplateAreaResult> {
  const [template] = await db
    .select({
      id: diagnosticTemplates.id,
    })
    .from(diagnosticTemplates)
    .where(eq(diagnosticTemplates.id, templateId))
    .limit(1);

  if (!template) {
    return { status: "template_not_found" };
  }

  const [existingArea] = await db
    .select({
      id: diagnosticTemplateAreas.id,
    })
    .from(diagnosticTemplateAreas)
    .where(
      and(
        eq(diagnosticTemplateAreas.templateId, templateId),
        eq(diagnosticTemplateAreas.slug, input.slug),
      ),
    )
    .limit(1);

  if (existingArea) {
    return { status: "area_already_exists" };
  }

  const displayOrder =
    input.displayOrder ?? (await getNextTemplateAreaDisplayOrder(templateId));

  const [areaRow] = await db
    .insert(diagnosticTemplateAreas)
    .values({
      templateId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      displayOrder,
    })
    .returning();

  if (!areaRow) {
    throw new Error("Diagnostic template area creation failed");
  }

  return {
    status: "created",
    area: {
      ...areaRow,
      questions: [],
    },
  };
}

export async function createDiagnosticTemplateQuestion(
  templateAreaId: string,
  input: CreateDiagnosticTemplateQuestionInput,
): Promise<CreateDiagnosticTemplateQuestionResult> {
  const [templateArea] = await db
    .select({
      id: diagnosticTemplateAreas.id,
    })
    .from(diagnosticTemplateAreas)
    .where(eq(diagnosticTemplateAreas.id, templateAreaId))
    .limit(1);

  if (!templateArea) {
    return { status: "template_area_not_found" };
  }

  const [existingQuestion] = await db
    .select({
      id: diagnosticTemplateQuestions.id,
    })
    .from(diagnosticTemplateQuestions)
    .where(
      and(
        eq(diagnosticTemplateQuestions.templateAreaId, templateAreaId),
        eq(diagnosticTemplateQuestions.question, input.question),
      ),
    )
    .limit(1);

  if (existingQuestion) {
    return { status: "question_already_exists" };
  }

  const displayOrder =
    input.displayOrder ?? (await getNextTemplateQuestionDisplayOrder(templateAreaId));

  const [question] = await db
    .insert(diagnosticTemplateQuestions)
    .values({
      templateAreaId,
      question: input.question,
      description: input.description,
      displayOrder,
    })
    .returning();

  if (!question) {
    throw new Error("Diagnostic template question creation failed");
  }

  return {
    status: "created",
    question,
  };
}

async function listTemplatesByFilter(
  whereClause?: ReturnType<typeof eq>,
): Promise<Array<DiagnosticTemplate>> {
  const templateQuery = db
    .select()
    .from(diagnosticTemplates)
    .orderBy(desc(diagnosticTemplates.isDefault), asc(diagnosticTemplates.name));

  const templates = whereClause
    ? await templateQuery.where(whereClause)
    : await templateQuery;

  if (templates.length === 0) {
    return [];
  }

  const templateIds = templates.map((template) => template.id);
  const areaRows = await db
    .select()
    .from(diagnosticTemplateAreas)
    .where(inArray(diagnosticTemplateAreas.templateId, templateIds))
    .orderBy(
      asc(diagnosticTemplateAreas.templateId),
      asc(diagnosticTemplateAreas.displayOrder),
    );

  const areaIds = areaRows.map((area) => area.id);
  const questionRows =
    areaIds.length === 0
      ? []
      : await db
          .select()
          .from(diagnosticTemplateQuestions)
          .where(inArray(diagnosticTemplateQuestions.templateAreaId, areaIds))
          .orderBy(
            asc(diagnosticTemplateQuestions.templateAreaId),
            asc(diagnosticTemplateQuestions.displayOrder),
          );

  const questionsByAreaId = questionRows.reduce<
    Map<string, Array<DiagnosticTemplateQuestion>>
  >((map, question) => {
    const questions = map.get(question.templateAreaId) ?? [];
    questions.push(question);
    map.set(question.templateAreaId, questions);
    return map;
  }, new Map());

  const areasByTemplateId = areaRows.reduce<Map<string, Array<DiagnosticTemplateArea>>>(
    (map, area) => {
      const areas = map.get(area.templateId) ?? [];
      areas.push({
        ...area,
        questions: questionsByAreaId.get(area.id) ?? [],
      });
      map.set(area.templateId, areas);
      return map;
    },
    new Map(),
  );

  return templates.map((template) => ({
    ...template,
    areas: areasByTemplateId.get(template.id) ?? [],
  }));
}

async function getNextTemplateAreaDisplayOrder(templateId: string): Promise<number> {
  const [lastArea] = await db
    .select({
      displayOrder: diagnosticTemplateAreas.displayOrder,
    })
    .from(diagnosticTemplateAreas)
    .where(eq(diagnosticTemplateAreas.templateId, templateId))
    .orderBy(desc(diagnosticTemplateAreas.displayOrder))
    .limit(1);

  return (lastArea?.displayOrder ?? 0) + 1;
}

async function getNextTemplateQuestionDisplayOrder(
  templateAreaId: string,
): Promise<number> {
  const [lastQuestion] = await db
    .select({
      displayOrder: diagnosticTemplateQuestions.displayOrder,
    })
    .from(diagnosticTemplateQuestions)
    .where(eq(diagnosticTemplateQuestions.templateAreaId, templateAreaId))
    .orderBy(desc(diagnosticTemplateQuestions.displayOrder))
    .limit(1);

  return (lastQuestion?.displayOrder ?? 0) + 1;
}
