import { and, desc, eq } from "drizzle-orm";

import {
  canManageManualMetrics,
  canViewOrganization,
} from "../../auth/organization-permissions.js";
import { db } from "../../database/index.js";
import { manualMetrics } from "../../database/schema/index.js";
import { getCurrentOrganizationMembership } from "../organizations/organizations.service.js";
import type {
  CreateManualMetricInput,
  CreateManualMetricResult,
  DeleteManualMetricResult,
  GetManualMetricByIdResult,
  ListManualMetricsResult,
  UpdateManualMetricInput,
  UpdateManualMetricResult,
} from "./manual-metrics.types.js";

export async function createManualMetric(
  currentUserId: string,
  input: CreateManualMetricInput,
): Promise<CreateManualMetricResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canManageManualMetrics(membership.role)) {
    return { status: "forbidden" };
  }

  const [manualMetric] = await db
    .insert(manualMetrics)
    .values({
      organizationId: membership.organization.id,
      createdByUserId: currentUserId,
      category: input.category,
      metricKey: input.metricKey,
      metricLabel: input.metricLabel,
      value: input.value,
      unit: input.unit,
      referenceDate: input.referenceDate,
      notes: input.notes,
    })
    .returning();

  if (!manualMetric) {
    throw new Error("Manual metric creation failed");
  }

  return { status: "created", manualMetric };
}

export async function listManualMetrics(
  currentUserId: string,
): Promise<ListManualMetricsResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canViewOrganization(membership.role)) {
    return { status: "organization_not_found" };
  }

  const manualMetricsList = await db
    .select()
    .from(manualMetrics)
    .where(eq(manualMetrics.organizationId, membership.organization.id))
    .orderBy(
      desc(manualMetrics.referenceDate),
      desc(manualMetrics.createdAt),
    );

  return { status: "found", manualMetrics: manualMetricsList };
}

export async function getManualMetricById(
  currentUserId: string,
  manualMetricId: string,
): Promise<GetManualMetricByIdResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canViewOrganization(membership.role)) {
    return { status: "organization_not_found" };
  }

  const [manualMetric] = await db
    .select()
    .from(manualMetrics)
    .where(
      and(
        eq(manualMetrics.id, manualMetricId),
        eq(manualMetrics.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!manualMetric) {
    return { status: "manual_metric_not_found" };
  }

  return { status: "found", manualMetric };
}

export async function updateManualMetric(
  currentUserId: string,
  manualMetricId: string,
  input: UpdateManualMetricInput,
): Promise<UpdateManualMetricResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canManageManualMetrics(membership.role)) {
    return { status: "forbidden" };
  }

  const [existingManualMetric] = await db
    .select({ id: manualMetrics.id })
    .from(manualMetrics)
    .where(
      and(
        eq(manualMetrics.id, manualMetricId),
        eq(manualMetrics.organizationId, membership.organization.id),
      ),
    )
    .limit(1);

  if (!existingManualMetric) {
    return { status: "manual_metric_not_found" };
  }

  const [manualMetric] = await db
    .update(manualMetrics)
    .set(input)
    .where(eq(manualMetrics.id, manualMetricId))
    .returning();

  if (!manualMetric) {
    throw new Error("Manual metric update failed");
  }

  return { status: "updated", manualMetric };
}

export async function deleteManualMetric(
  currentUserId: string,
  manualMetricId: string,
): Promise<DeleteManualMetricResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canManageManualMetrics(membership.role)) {
    return { status: "forbidden" };
  }

  const [manualMetric] = await db
    .delete(manualMetrics)
    .where(
      and(
        eq(manualMetrics.id, manualMetricId),
        eq(manualMetrics.organizationId, membership.organization.id),
      ),
    )
    .returning();

  if (!manualMetric) {
    return { status: "manual_metric_not_found" };
  }

  return { status: "deleted", manualMetric };
}
