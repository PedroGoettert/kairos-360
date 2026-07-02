import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";

import { canManageBaseline } from "../../auth/organization-permissions.js";
import { db } from "../../database/index.js";
import {
  baselineDiagnosticAnswers,
  diagnosticTemplateAreas,
  diagnosticTemplateQuestions,
  diagnosticTemplates,
  organizationBaselineAreas,
  organizationBaselineQuestions,
} from "../../database/schema/index.js";
import { getCurrentOrganizationMembership } from "../organizations/organizations.service.js";
import type {
  ApplyTemplateToOrganizationInput,
  ApplyTemplateToOrganizationResult,
  CreateOrganizationBaselineAreaInput,
  CreateOrganizationBaselineAreaResult,
  CreateOrganizationBaselineQuestionInput,
  CreateOrganizationBaselineQuestionResult,
  DeleteOrganizationBaselineAreaResult,
  DeleteOrganizationBaselineQuestionResult,
  GetOrganizationBaselineAreaByIdResult,
  OrganizationBaselineAreasList,
  OrganizationBaselineQuestion,
  OrganizationBaselineAccessResult,
  UpdateOrganizationBaselineAreaInput,
  UpdateOrganizationBaselineAreaResult,
  UpdateOrganizationBaselineQuestionInput,
  UpdateOrganizationBaselineQuestionResult,
} from "./organization-baseline.types.js";

export async function listOrganizationBaselineAreas(
  currentUserId: string,
): Promise<OrganizationBaselineAccessResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  return {
    status: "found",
    areas: await listOrganizationBaselineAreasByOrganizationId(
      membership.organization.id,
    ),
  };
}

export async function getOrganizationBaselineAreaById(
  currentUserId: string,
  areaId: string,
): Promise<GetOrganizationBaselineAreaByIdResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "area_not_found" };
  }

  const [area] = await db
    .select({
      id: organizationBaselineAreas.id,
      organizationId: organizationBaselineAreas.organizationId,
      templateAreaId: organizationBaselineAreas.templateAreaId,
      name: organizationBaselineAreas.name,
      slug: organizationBaselineAreas.slug,
      description: organizationBaselineAreas.description,
      displayOrder: organizationBaselineAreas.displayOrder,
      isActive: organizationBaselineAreas.isActive,
    })
    .from(organizationBaselineAreas)
    .where(
      and(
        eq(organizationBaselineAreas.id, areaId),
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  const questions = await db
    .select({
      id: organizationBaselineQuestions.id,
      organizationAreaId: organizationBaselineQuestions.organizationAreaId,
      question: organizationBaselineQuestions.question,
      description: organizationBaselineQuestions.description,
      displayOrder: organizationBaselineQuestions.displayOrder,
      isActive: organizationBaselineQuestions.isActive,
    })
    .from(organizationBaselineQuestions)
    .where(eq(organizationBaselineQuestions.organizationAreaId, areaId))
    .orderBy(asc(organizationBaselineQuestions.displayOrder));

  return {
    status: "found",
    area: {
      ...area,
      questions,
    },
  };
}

export async function applyTemplateToOrganization(
  currentUserId: string,
  input: ApplyTemplateToOrganizationInput,
): Promise<ApplyTemplateToOrganizationResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canManageBaseline(membership.role)) {
    return { status: "forbidden" };
  }

  const [template] = await db
    .select({ id: diagnosticTemplates.id })
    .from(diagnosticTemplates)
    .where(eq(diagnosticTemplates.id, input.templateId))
    .limit(1);

  if (!template) {
    return { status: "template_not_found" };
  }

  const [existingArea] = await db
    .select({ id: organizationBaselineAreas.id })
    .from(organizationBaselineAreas)
    .where(eq(organizationBaselineAreas.organizationId, membership.organization.id))
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
        .insert(organizationBaselineAreas)
        .values({
          organizationId: membership.organization.id,
          templateAreaId: area.id,
          name: area.name,
          slug: area.slug,
          description: area.description,
          displayOrder: area.displayOrder,
        })
        .returning({ id: organizationBaselineAreas.id });

      if (!createdArea) {
        throw new Error("Organization baseline area creation from template failed");
      }

      areaIdMap.set(area.id, createdArea.id);
    }

    for (const question of templateQuestions) {
      const organizationAreaId = areaIdMap.get(question.templateAreaId);

      if (!organizationAreaId) {
        continue;
      }

      await tx.insert(organizationBaselineQuestions).values({
        organizationAreaId,
        templateQuestionId: question.id,
        question: question.question,
        description: question.description,
        displayOrder: question.displayOrder,
      });
    }
  });

  return {
    status: "created",
    areas: await listOrganizationBaselineAreasByOrganizationId(
      membership.organization.id,
    ),
  };
}

export async function createOrganizationBaselineArea(
  currentUserId: string,
  input: CreateOrganizationBaselineAreaInput,
): Promise<CreateOrganizationBaselineAreaResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canManageBaseline(membership.role)) {
    return { status: "forbidden" };
  }

  const [existingArea] = await db
    .select({ id: organizationBaselineAreas.id })
    .from(organizationBaselineAreas)
    .where(
      and(
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
        eq(organizationBaselineAreas.slug, input.slug),
      ),
    )
    .limit(1);

  if (existingArea) {
    return { status: "area_already_exists" };
  }

  const displayOrder =
    input.displayOrder ??
    (await getNextOrganizationAreaDisplayOrder(membership.organization.id));

  const [area] = await db
    .insert(organizationBaselineAreas)
    .values({
      organizationId: membership.organization.id,
      name: input.name,
      slug: input.slug,
      description: input.description,
      displayOrder,
    })
    .returning();

  if (!area) {
    throw new Error("Organization baseline area creation failed");
  }

  return {
    status: "created",
    area: {
      ...area,
      questions: [],
    },
  };
}

export async function createOrganizationBaselineQuestion(
  currentUserId: string,
  areaId: string,
  input: CreateOrganizationBaselineQuestionInput,
): Promise<CreateOrganizationBaselineQuestionResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "area_not_found" };
  }

  if (!canManageBaseline(membership.role)) {
    return { status: "forbidden" };
  }

  const [area] = await db
    .select({ id: organizationBaselineAreas.id })
    .from(organizationBaselineAreas)
    .where(
      and(
        eq(organizationBaselineAreas.id, areaId),
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  const [existingQuestion] = await db
    .select({ id: organizationBaselineQuestions.id })
    .from(organizationBaselineQuestions)
    .where(
      and(
        eq(organizationBaselineQuestions.organizationAreaId, areaId),
        eq(organizationBaselineQuestions.question, input.question),
      ),
    )
    .limit(1);

  if (existingQuestion) {
    return { status: "question_already_exists" };
  }

  const displayOrder =
    input.displayOrder ?? (await getNextOrganizationQuestionDisplayOrder(areaId));

  const [question] = await db
    .insert(organizationBaselineQuestions)
    .values({
      organizationAreaId: areaId,
      question: input.question,
      description: input.description,
      displayOrder,
    })
    .returning({
      id: organizationBaselineQuestions.id,
      organizationAreaId: organizationBaselineQuestions.organizationAreaId,
      question: organizationBaselineQuestions.question,
      description: organizationBaselineQuestions.description,
      displayOrder: organizationBaselineQuestions.displayOrder,
      isActive: organizationBaselineQuestions.isActive,
    });

  if (!question) {
    throw new Error("Organization baseline question creation failed");
  }

  return {
    status: "created",
    question,
  };
}

async function listOrganizationBaselineAreasByOrganizationId(
  organizationId: string,
): Promise<OrganizationBaselineAreasList> {
  const areas = await db
    .select()
    .from(organizationBaselineAreas)
    .where(eq(organizationBaselineAreas.organizationId, organizationId))
    .orderBy(asc(organizationBaselineAreas.displayOrder));

  const areaIds = areas.map((area) => area.id);
  const questions =
    areaIds.length === 0
      ? []
      : await db
          .select({
            id: organizationBaselineQuestions.id,
            organizationAreaId: organizationBaselineQuestions.organizationAreaId,
            question: organizationBaselineQuestions.question,
            description: organizationBaselineQuestions.description,
            displayOrder: organizationBaselineQuestions.displayOrder,
            isActive: organizationBaselineQuestions.isActive,
          })
          .from(organizationBaselineQuestions)
          .where(
            inArray(organizationBaselineQuestions.organizationAreaId, areaIds),
          )
          .orderBy(
            asc(organizationBaselineQuestions.organizationAreaId),
            asc(organizationBaselineQuestions.displayOrder),
          );

  const questionsByAreaId = questions.reduce<
    Map<string, Array<OrganizationBaselineQuestion>>
  >((map, question) => {
    const areaQuestions = map.get(question.organizationAreaId) ?? [];
    areaQuestions.push(question);
    map.set(question.organizationAreaId, areaQuestions);
    return map;
  }, new Map());

  return areas.map((area) => ({
    ...area,
    questions: questionsByAreaId.get(area.id) ?? [],
  }));
}

async function getNextOrganizationAreaDisplayOrder(
  organizationId: string,
): Promise<number> {
  const [lastArea] = await db
    .select({ displayOrder: organizationBaselineAreas.displayOrder })
    .from(organizationBaselineAreas)
    .where(eq(organizationBaselineAreas.organizationId, organizationId))
    .orderBy(desc(organizationBaselineAreas.displayOrder))
    .limit(1);

  return (lastArea?.displayOrder ?? 0) + 1;
}

async function getNextOrganizationQuestionDisplayOrder(
  areaId: string,
): Promise<number> {
  const [lastQuestion] = await db
    .select({ displayOrder: organizationBaselineQuestions.displayOrder })
    .from(organizationBaselineQuestions)
    .where(eq(organizationBaselineQuestions.organizationAreaId, areaId))
    .orderBy(desc(organizationBaselineQuestions.displayOrder))
    .limit(1);

  return (lastQuestion?.displayOrder ?? 0) + 1;
}

export async function updateOrganizationBaselineArea(
  currentUserId: string,
  areaId: string,
  input: UpdateOrganizationBaselineAreaInput,
): Promise<UpdateOrganizationBaselineAreaResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "area_not_found" };
  }

  if (!canManageBaseline(membership.role)) {
    return { status: "forbidden" };
  }

  const [area] = await db
    .select({
      id: organizationBaselineAreas.id,
      organizationId: organizationBaselineAreas.organizationId,
      slug: organizationBaselineAreas.slug,
    })
    .from(organizationBaselineAreas)
    .where(
      and(
        eq(organizationBaselineAreas.id, areaId),
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  if (input.slug && input.slug !== area.slug) {
    const [existingArea] = await db
      .select({ id: organizationBaselineAreas.id })
      .from(organizationBaselineAreas)
      .where(
        and(
          eq(organizationBaselineAreas.organizationId, area.organizationId),
          eq(organizationBaselineAreas.slug, input.slug),
          ne(organizationBaselineAreas.id, areaId),
        ),
      )
      .limit(1);

    if (existingArea) {
      return { status: "slug_already_exists" };
    }
  }

  const [updatedArea] = await db
    .update(organizationBaselineAreas)
    .set(input)
    .where(eq(organizationBaselineAreas.id, areaId))
    .returning();

  if (!updatedArea) {
    throw new Error("Organization baseline area update failed");
  }

  const questions = await db
    .select({
      id: organizationBaselineQuestions.id,
      organizationAreaId: organizationBaselineQuestions.organizationAreaId,
      question: organizationBaselineQuestions.question,
      description: organizationBaselineQuestions.description,
      displayOrder: organizationBaselineQuestions.displayOrder,
      isActive: organizationBaselineQuestions.isActive,
    })
    .from(organizationBaselineQuestions)
    .where(eq(organizationBaselineQuestions.organizationAreaId, areaId))
    .orderBy(asc(organizationBaselineQuestions.displayOrder));

  return {
    status: "updated",
    area: {
      ...updatedArea,
      questions,
    },
  };
}

export async function deleteOrganizationBaselineArea(
  currentUserId: string,
  areaId: string,
): Promise<DeleteOrganizationBaselineAreaResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "area_not_found" };
  }

  if (!canManageBaseline(membership.role)) {
    return { status: "forbidden" };
  }

  const [area] = await db
    .select({ id: organizationBaselineAreas.id })
    .from(organizationBaselineAreas)
    .where(
      and(
        eq(organizationBaselineAreas.id, areaId),
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!area) {
    return { status: "area_not_found" };
  }

  await db
    .update(organizationBaselineAreas)
    .set({ isActive: false })
    .where(eq(organizationBaselineAreas.id, areaId));

  return { status: "deactivated" };
}

export async function updateOrganizationBaselineQuestion(
  currentUserId: string,
  questionId: string,
  input: UpdateOrganizationBaselineQuestionInput,
): Promise<UpdateOrganizationBaselineQuestionResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "question_not_found" };
  }

  if (!canManageBaseline(membership.role)) {
    return { status: "forbidden" };
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
        eq(organizationBaselineQuestions.id, questionId),
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!question) {
    return { status: "question_not_found" };
  }

  const [updatedQuestion] = await db
    .update(organizationBaselineQuestions)
    .set(input)
    .where(eq(organizationBaselineQuestions.id, questionId))
    .returning({
      id: organizationBaselineQuestions.id,
      organizationAreaId: organizationBaselineQuestions.organizationAreaId,
      question: organizationBaselineQuestions.question,
      description: organizationBaselineQuestions.description,
      displayOrder: organizationBaselineQuestions.displayOrder,
      isActive: organizationBaselineQuestions.isActive,
    });

  if (!updatedQuestion) {
    throw new Error("Organization baseline question update failed");
  }

  return {
    status: "updated",
    question: updatedQuestion,
  };
}

export async function deleteOrganizationBaselineQuestion(
  currentUserId: string,
  questionId: string,
): Promise<DeleteOrganizationBaselineQuestionResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "question_not_found" };
  }

  if (!canManageBaseline(membership.role)) {
    return { status: "forbidden" };
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
        eq(organizationBaselineQuestions.id, questionId),
        eq(organizationBaselineAreas.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!question) {
    return { status: "question_not_found" };
  }

  const [existingAnswer] = await db
    .select({ id: baselineDiagnosticAnswers.id })
    .from(baselineDiagnosticAnswers)
    .where(eq(baselineDiagnosticAnswers.questionId, questionId))
    .limit(1);

  if (existingAnswer) {
    await db
      .update(organizationBaselineQuestions)
      .set({ isActive: false })
      .where(eq(organizationBaselineQuestions.id, questionId));

    return { status: "deactivated" };
  }

  await db
    .delete(organizationBaselineQuestions)
    .where(eq(organizationBaselineQuestions.id, questionId));

  return { status: "deleted" };
}
