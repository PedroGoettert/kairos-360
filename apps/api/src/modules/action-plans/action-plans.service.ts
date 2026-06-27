import { and, desc, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  actionPlans,
  companies,
  companyDiagnosticAreas,
  diagnostics,
} from "../../database/schema/index.js";
import { getCompanyById } from "../companies/companies.service.js";
import type {
  ActionPlan,
  ActionPlansList,
  CreateActionPlanInput,
  CreateActionPlanResult,
  UpdateActionPlanInput,
  UpdateActionPlanResult,
  UpdateActionPlanStatusInput,
} from "./action-plans.types.js";

export async function createActionPlan(
  currentUserId: string,
  input: CreateActionPlanInput,
): Promise<CreateActionPlanResult> {
  const company = await getCompanyById(currentUserId, input.companyId);

  if (!company) {
    return { status: "company_not_found" };
  }

  if (input.diagnosticId) {
    const [diagnostic] = await db
      .select({ id: diagnostics.id })
      .from(diagnostics)
      .where(
        and(
          eq(diagnostics.id, input.diagnosticId),
          eq(diagnostics.companyId, input.companyId),
        ),
      )
      .limit(1);

    if (!diagnostic) {
      return { status: "diagnostic_not_found" };
    }
  }

  if (input.areaId) {
    const [area] = await db
      .select({ id: companyDiagnosticAreas.id })
      .from(companyDiagnosticAreas)
      .where(
        and(
          eq(companyDiagnosticAreas.id, input.areaId),
          eq(companyDiagnosticAreas.companyId, input.companyId),
        ),
      )
      .limit(1);

    if (!area) {
      return { status: "area_not_found" };
    }
  }

  const [actionPlan] = await db
    .insert(actionPlans)
    .values({
      companyId: input.companyId,
      createdByUserId: currentUserId,
      diagnosticId: input.diagnosticId,
      areaId: input.areaId,
      title: input.title,
      description: input.description,
      responsible: input.responsible,
      dueDate: input.dueDate,
      status: input.status ?? "not_started",
    })
    .returning();

  if (!actionPlan) {
    throw new Error("Action plan creation failed");
  }

  return {
    status: "created",
    actionPlan,
  };
}

export async function listActionPlansByCompany(
  currentUserId: string,
  companyId: string,
): Promise<ActionPlansList | null> {
  const company = await getCompanyById(currentUserId, companyId);

  if (!company) {
    return null;
  }

  return db
    .select()
    .from(actionPlans)
    .where(eq(actionPlans.companyId, companyId))
    .orderBy(desc(actionPlans.createdAt));
}

export async function getActionPlanById(
  currentUserId: string,
  actionPlanId: string,
): Promise<ActionPlan | null> {
  const [actionPlan] = await db
    .select({
      id: actionPlans.id,
      companyId: actionPlans.companyId,
      createdByUserId: actionPlans.createdByUserId,
      diagnosticId: actionPlans.diagnosticId,
      areaId: actionPlans.areaId,
      title: actionPlans.title,
      description: actionPlans.description,
      responsible: actionPlans.responsible,
      dueDate: actionPlans.dueDate,
      status: actionPlans.status,
      createdAt: actionPlans.createdAt,
      updatedAt: actionPlans.updatedAt,
    })
    .from(actionPlans)
    .innerJoin(companies, eq(actionPlans.companyId, companies.id))
    .where(
      and(
        eq(actionPlans.id, actionPlanId),
        eq(companies.ownerUserId, currentUserId),
      ),
    )
    .limit(1);

  return actionPlan ?? null;
}

export async function updateActionPlan(
  currentUserId: string,
  actionPlanId: string,
  input: UpdateActionPlanInput,
): Promise<UpdateActionPlanResult> {
  const existingActionPlan = await getActionPlanById(currentUserId, actionPlanId);

  if (!existingActionPlan) {
    return { status: "action_plan_not_found" };
  }

  if (input.diagnosticId) {
    const [diagnostic] = await db
      .select({ id: diagnostics.id })
      .from(diagnostics)
      .where(
        and(
          eq(diagnostics.id, input.diagnosticId),
          eq(diagnostics.companyId, existingActionPlan.companyId),
        ),
      )
      .limit(1);

    if (!diagnostic) {
      return { status: "diagnostic_not_found" };
    }
  }

  if (input.areaId) {
    const [area] = await db
      .select({ id: companyDiagnosticAreas.id })
      .from(companyDiagnosticAreas)
      .where(
        and(
          eq(companyDiagnosticAreas.id, input.areaId),
          eq(companyDiagnosticAreas.companyId, existingActionPlan.companyId),
        ),
      )
      .limit(1);

    if (!area) {
      return { status: "area_not_found" };
    }
  }

  const [actionPlan] = await db
    .update(actionPlans)
    .set(input)
    .where(eq(actionPlans.id, actionPlanId))
    .returning();

  if (!actionPlan) {
    throw new Error("Action plan update failed");
  }

  return {
    status: "updated",
    actionPlan,
  };
}

export async function updateActionPlanStatus(
  currentUserId: string,
  actionPlanId: string,
  input: UpdateActionPlanStatusInput,
): Promise<ActionPlan | null> {
  const existingActionPlan = await getActionPlanById(currentUserId, actionPlanId);

  if (!existingActionPlan) {
    return null;
  }

  const [actionPlan] = await db
    .update(actionPlans)
    .set({
      status: input.status,
    })
    .where(eq(actionPlans.id, actionPlanId))
    .returning();

  return actionPlan ?? null;
}
