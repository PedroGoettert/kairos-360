import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  companyDiagnosticAreas,
  companyDiagnosticQuestions,
  companies,
  diagnosticTemplateAreas,
  diagnosticTemplateQuestions,
  diagnosticTemplates,
} from "../../database/schema/index.js";
import { getCompanyById } from "../companies/companies.service.js";
import type {
  ApplyTemplateToCompanyInput,
  ApplyTemplateToCompanyResult,
  CompanyDiagnosticArea,
  CompanyDiagnosticAreasList,
  CompanyDiagnosticQuestion,
  CreateCompanyDiagnosticAreaInput,
  CreateCompanyDiagnosticAreaResult,
  CreateCompanyDiagnosticQuestionInput,
  CreateCompanyDiagnosticQuestionResult,
  GetCompanyDiagnosticAreaByIdResult,
  ListCompanyDiagnosticAreasResult,
} from "./company-diagnostic-areas.types.js";

export async function listCompanyDiagnosticAreas(
  currentUserId: string,
  companyId: string,
): Promise<ListCompanyDiagnosticAreasResult> {
  const company = await getCompanyById(currentUserId, companyId);

  if (!company) {
    return { status: "company_not_found" };
  }

  return {
    status: "found",
    areas: await listCompanyDiagnosticAreasByCompanyId(companyId),
  };
}

export async function getCompanyDiagnosticAreaById(
  currentUserId: string,
  areaId: string,
): Promise<GetCompanyDiagnosticAreaByIdResult> {
  const [area] = await db
    .select({
      id: companyDiagnosticAreas.id,
      companyId: companyDiagnosticAreas.companyId,
      templateAreaId: companyDiagnosticAreas.templateAreaId,
      name: companyDiagnosticAreas.name,
      slug: companyDiagnosticAreas.slug,
      description: companyDiagnosticAreas.description,
      displayOrder: companyDiagnosticAreas.displayOrder,
      isActive: companyDiagnosticAreas.isActive,
    })
    .from(companyDiagnosticAreas)
    .innerJoin(
      companies,
      eq(companyDiagnosticAreas.companyId, companies.id),
    )
    .where(
      and(
        eq(companyDiagnosticAreas.id, areaId),
        eq(companies.ownerUserId, currentUserId),
      ),
    )
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  const questions = await db
    .select({
      id: companyDiagnosticQuestions.id,
      companyAreaId: companyDiagnosticQuestions.companyAreaId,
      question: companyDiagnosticQuestions.question,
      description: companyDiagnosticQuestions.description,
      displayOrder: companyDiagnosticQuestions.displayOrder,
      isActive: companyDiagnosticQuestions.isActive,
    })
    .from(companyDiagnosticQuestions)
    .where(eq(companyDiagnosticQuestions.companyAreaId, areaId))
    .orderBy(asc(companyDiagnosticQuestions.displayOrder));

  return {
    status: "found",
    area: {
      ...area,
      questions,
    },
  };
}

export async function applyTemplateToCompany(
  currentUserId: string,
  companyId: string,
  input: ApplyTemplateToCompanyInput,
): Promise<ApplyTemplateToCompanyResult> {
  const company = await getCompanyById(currentUserId, companyId);

  if (!company) {
    return { status: "company_not_found" };
  }

  const [template] = await db
    .select({
      id: diagnosticTemplates.id,
    })
    .from(diagnosticTemplates)
    .where(eq(diagnosticTemplates.id, input.templateId))
    .limit(1);

  if (!template) {
    return { status: "template_not_found" };
  }

  const [existingArea] = await db
    .select({
      id: companyDiagnosticAreas.id,
    })
    .from(companyDiagnosticAreas)
    .where(eq(companyDiagnosticAreas.companyId, companyId))
    .limit(1);

  if (existingArea) {
    return { status: "setup_already_exists" };
  }

  const templateAreas = await db
    .select()
    .from(diagnosticTemplateAreas)
    .where(eq(diagnosticTemplateAreas.templateId, input.templateId))
    .orderBy(asc(diagnosticTemplateAreas.displayOrder));

  const templateAreaIds = templateAreas.map((area) => area.id);
  const templateQuestions =
    templateAreaIds.length === 0
      ? []
      : await db
          .select()
          .from(diagnosticTemplateQuestions)
          .where(inArray(diagnosticTemplateQuestions.templateAreaId, templateAreaIds))
          .orderBy(
            asc(diagnosticTemplateQuestions.templateAreaId),
            asc(diagnosticTemplateQuestions.displayOrder),
          );

  await db.transaction(async (tx) => {
    const areaIdMap = new Map<string, string>();

    for (const area of templateAreas) {
      const [createdArea] = await tx
        .insert(companyDiagnosticAreas)
        .values({
          companyId,
          templateAreaId: area.id,
          name: area.name,
          slug: area.slug,
          description: area.description,
          displayOrder: area.displayOrder,
        })
        .returning({
          id: companyDiagnosticAreas.id,
        });

      if (!createdArea) {
        throw new Error("Company diagnostic area creation from template failed");
      }

      areaIdMap.set(area.id, createdArea.id);
    }

    for (const question of templateQuestions) {
      const companyAreaId = areaIdMap.get(question.templateAreaId);

      if (!companyAreaId) {
        continue;
      }

      await tx.insert(companyDiagnosticQuestions).values({
        companyAreaId,
        templateQuestionId: question.id,
        question: question.question,
        description: question.description,
        displayOrder: question.displayOrder,
      });
    }
  });

  return {
    status: "created",
    areas: await listCompanyDiagnosticAreasByCompanyId(companyId),
  };
}

export async function createCompanyDiagnosticArea(
  currentUserId: string,
  companyId: string,
  input: CreateCompanyDiagnosticAreaInput,
): Promise<CreateCompanyDiagnosticAreaResult> {
  const company = await getCompanyById(currentUserId, companyId);

  if (!company) {
    return { status: "company_not_found" };
  }

  const [existingArea] = await db
    .select({
      id: companyDiagnosticAreas.id,
    })
    .from(companyDiagnosticAreas)
    .where(
      and(
        eq(companyDiagnosticAreas.companyId, companyId),
        eq(companyDiagnosticAreas.slug, input.slug),
      ),
    )
    .limit(1);

  if (existingArea) {
    return { status: "area_already_exists" };
  }

  const displayOrder =
    input.displayOrder ?? (await getNextCompanyAreaDisplayOrder(companyId));

  const [area] = await db
    .insert(companyDiagnosticAreas)
    .values({
      companyId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      displayOrder,
    })
    .returning();

  if (!area) {
    throw new Error("Company diagnostic area creation failed");
  }

  return {
    status: "created",
    area: {
      ...area,
      questions: [],
    },
  };
}

export async function createCompanyDiagnosticQuestion(
  currentUserId: string,
  areaId: string,
  input: CreateCompanyDiagnosticQuestionInput,
): Promise<CreateCompanyDiagnosticQuestionResult> {
  const [area] = await db
    .select({
      id: companyDiagnosticAreas.id,
    })
    .from(companyDiagnosticAreas)
    .innerJoin(
      companies,
      eq(companyDiagnosticAreas.companyId, companies.id),
    )
    .where(
      and(
        eq(companyDiagnosticAreas.id, areaId),
        eq(companies.ownerUserId, currentUserId),
      ),
    )
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  const [existingQuestion] = await db
    .select({
      id: companyDiagnosticQuestions.id,
    })
    .from(companyDiagnosticQuestions)
    .where(
      and(
        eq(companyDiagnosticQuestions.companyAreaId, areaId),
        eq(companyDiagnosticQuestions.question, input.question),
      ),
    )
    .limit(1);

  if (existingQuestion) {
    return { status: "question_already_exists" };
  }

  const displayOrder =
    input.displayOrder ?? (await getNextCompanyQuestionDisplayOrder(areaId));

  const [question] = await db
    .insert(companyDiagnosticQuestions)
    .values({
      companyAreaId: areaId,
      question: input.question,
      description: input.description,
      displayOrder,
    })
    .returning({
      id: companyDiagnosticQuestions.id,
      companyAreaId: companyDiagnosticQuestions.companyAreaId,
      question: companyDiagnosticQuestions.question,
      description: companyDiagnosticQuestions.description,
      displayOrder: companyDiagnosticQuestions.displayOrder,
      isActive: companyDiagnosticQuestions.isActive,
    });

  if (!question) {
    throw new Error("Company diagnostic question creation failed");
  }

  return {
    status: "created",
    question,
  };
}

async function listCompanyDiagnosticAreasByCompanyId(
  companyId: string,
): Promise<CompanyDiagnosticAreasList> {
  const areas = await db
    .select()
    .from(companyDiagnosticAreas)
    .where(eq(companyDiagnosticAreas.companyId, companyId))
    .orderBy(asc(companyDiagnosticAreas.displayOrder));

  const areaIds = areas.map((area) => area.id);
  const questions =
    areaIds.length === 0
      ? []
      : await db
          .select({
            id: companyDiagnosticQuestions.id,
            companyAreaId: companyDiagnosticQuestions.companyAreaId,
            question: companyDiagnosticQuestions.question,
            description: companyDiagnosticQuestions.description,
            displayOrder: companyDiagnosticQuestions.displayOrder,
            isActive: companyDiagnosticQuestions.isActive,
          })
          .from(companyDiagnosticQuestions)
          .where(inArray(companyDiagnosticQuestions.companyAreaId, areaIds))
          .orderBy(
            asc(companyDiagnosticQuestions.companyAreaId),
            asc(companyDiagnosticQuestions.displayOrder),
          );

  const questionsByAreaId = questions.reduce<
    Map<string, Array<CompanyDiagnosticQuestion>>
  >((map, question) => {
    const areaQuestions = map.get(question.companyAreaId) ?? [];
    areaQuestions.push(question);
    map.set(question.companyAreaId, areaQuestions);
    return map;
  }, new Map());

  return areas.map((area) => ({
    ...area,
    questions: questionsByAreaId.get(area.id) ?? [],
  }));
}

async function getNextCompanyAreaDisplayOrder(companyId: string): Promise<number> {
  const [lastArea] = await db
    .select({
      displayOrder: companyDiagnosticAreas.displayOrder,
    })
    .from(companyDiagnosticAreas)
    .where(eq(companyDiagnosticAreas.companyId, companyId))
    .orderBy(desc(companyDiagnosticAreas.displayOrder))
    .limit(1);

  return (lastArea?.displayOrder ?? 0) + 1;
}

async function getNextCompanyQuestionDisplayOrder(areaId: string): Promise<number> {
  const [lastQuestion] = await db
    .select({
      displayOrder: companyDiagnosticQuestions.displayOrder,
    })
    .from(companyDiagnosticQuestions)
    .where(eq(companyDiagnosticQuestions.companyAreaId, areaId))
    .orderBy(desc(companyDiagnosticQuestions.displayOrder))
    .limit(1);

  return (lastQuestion?.displayOrder ?? 0) + 1;
}
