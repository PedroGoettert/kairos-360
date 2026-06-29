import { and, asc, eq, ne } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  organizationUsers,
  organizations,
  user,
} from "../../database/schema/index.js";
import type {
  CreateOrganizationInput,
  CreateOrganizationResult,
  CreateOrganizationUserInput,
  CreateOrganizationUserResult,
  Organization,
  OrganizationUser,
  OrganizationUsersList,
  OrganizationUserRole,
  UpdateOrganizationInput,
  UpdateOrganizationResult,
  UpdateOrganizationUserRoleInput,
  UpdateOrganizationUserRoleResult,
} from "./organizations.types.js";

function slugifyOrganizationName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getCurrentOrganizationMembership(currentUserId: string) {
  const [membership] = await db
    .select({
      id: organizationUsers.id,
      organizationId: organizationUsers.organizationId,
      userId: organizationUsers.userId,
      role: organizationUsers.role,
      status: organizationUsers.status,
      organization: {
        id: organizations.id,
        createdByUserId: organizations.createdByUserId,
        name: organizations.name,
        slug: organizations.slug,
        tradeName: organizations.tradeName,
        document: organizations.document,
        industry: organizations.industry,
        website: organizations.website,
        notes: organizations.notes,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
      },
    })
    .from(organizationUsers)
    .innerJoin(
      organizations,
      eq(organizationUsers.organizationId, organizations.id),
    )
    .where(
      and(
        eq(organizationUsers.userId, currentUserId),
        eq(organizationUsers.status, "active"),
      ),
    )
    .orderBy(asc(organizationUsers.createdAt))
    .limit(1);

  return membership ?? null;
}

async function ensureOrganizationSlugAvailable(slug: string, excludeId?: string) {
  const [existing] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(
      excludeId
        ? and(eq(organizations.slug, slug), ne(organizations.id, excludeId))
        : eq(organizations.slug, slug),
    )
    .limit(1);

  return !existing;
}

function canManageOrganization(role: OrganizationUserRole): boolean {
  return role === "owner" || role === "admin";
}

export async function createOrganization(
  currentUserId: string,
  input: CreateOrganizationInput,
): Promise<CreateOrganizationResult> {
  const existingMembership =
    await getCurrentOrganizationMembership(currentUserId);

  if (existingMembership) {
    return { status: "user_already_has_organization" };
  }

  const slug = input.slug ? slugifyOrganizationName(input.slug) : slugifyOrganizationName(input.name);

  if (!(await ensureOrganizationSlugAvailable(slug))) {
    return { status: "slug_already_exists" };
  }

  const organization = await db.transaction(async (tx) => {
    const [createdOrganization] = await tx
      .insert(organizations)
      .values({
        createdByUserId: currentUserId,
        name: input.name,
        slug,
        tradeName: input.tradeName,
        document: input.document,
        industry: input.industry,
        website: input.website,
        notes: input.notes,
      })
      .returning();

    if (!createdOrganization) {
      throw new Error("Organization creation failed");
    }

    await tx.insert(organizationUsers).values({
      organizationId: createdOrganization.id,
      userId: currentUserId,
      role: "owner",
      status: "active",
    });

    return createdOrganization;
  });

  return {
    status: "created",
    organization,
  };
}

export async function getCurrentOrganization(
  currentUserId: string,
): Promise<Organization | null> {
  const membership = await getCurrentOrganizationMembership(currentUserId);
  return membership?.organization ?? null;
}

export async function updateCurrentOrganization(
  currentUserId: string,
  input: UpdateOrganizationInput,
): Promise<UpdateOrganizationResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canManageOrganization(membership.role)) {
    return { status: "forbidden" };
  }

  const nextSlug =
    input.slug === undefined ? undefined : slugifyOrganizationName(input.slug);

  if (
    nextSlug !== undefined &&
    !(await ensureOrganizationSlugAvailable(nextSlug, membership.organization.id))
  ) {
    return { status: "slug_already_exists" };
  }

  const [organization] = await db
    .update(organizations)
    .set({
      ...input,
      ...(nextSlug === undefined ? {} : { slug: nextSlug }),
    })
    .where(eq(organizations.id, membership.organization.id))
    .returning();

  if (!organization) {
    throw new Error("Organization update failed");
  }

  return {
    status: "updated",
    organization,
  };
}

export async function listCurrentOrganizationUsers(
  currentUserId: string,
): Promise<OrganizationUsersList | null> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return null;
  }

  return db
    .select({
      id: organizationUsers.id,
      organizationId: organizationUsers.organizationId,
      userId: organizationUsers.userId,
      role: organizationUsers.role,
      status: organizationUsers.status,
      createdAt: organizationUsers.createdAt,
      updatedAt: organizationUsers.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      },
    })
    .from(organizationUsers)
    .innerJoin(user, eq(organizationUsers.userId, user.id))
    .where(eq(organizationUsers.organizationId, membership.organization.id))
    .orderBy(asc(organizationUsers.createdAt));
}

export async function createOrganizationUser(
  currentUserId: string,
  input: CreateOrganizationUserInput,
): Promise<CreateOrganizationUserResult> {
  const membership = await getCurrentOrganizationMembership(currentUserId);

  if (!membership) {
    return { status: "organization_not_found" };
  }

  if (!canManageOrganization(membership.role)) {
    return { status: "forbidden" };
  }

  const [targetUser] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
    })
    .from(user)
    .where(eq(user.email, input.email))
    .limit(1);

  if (!targetUser) {
    return { status: "user_not_found" };
  }

  const [existingMembership] = await db
    .select({ id: organizationUsers.id })
    .from(organizationUsers)
    .where(
      and(
        eq(organizationUsers.organizationId, membership.organization.id),
        eq(organizationUsers.userId, targetUser.id),
      ),
    )
    .limit(1);

  if (existingMembership) {
    return { status: "membership_already_exists" };
  }

  const [organizationUser] = await db
    .insert(organizationUsers)
    .values({
      organizationId: membership.organization.id,
      userId: targetUser.id,
      role: input.role,
      status: "active",
    })
    .returning({
      id: organizationUsers.id,
      organizationId: organizationUsers.organizationId,
      userId: organizationUsers.userId,
      role: organizationUsers.role,
      status: organizationUsers.status,
      createdAt: organizationUsers.createdAt,
      updatedAt: organizationUsers.updatedAt,
    });

  if (!organizationUser) {
    throw new Error("Organization membership creation failed");
  }

  return {
    status: "created",
    organizationUser: {
      ...organizationUser,
      user: targetUser,
    },
  };
}

export async function updateOrganizationUserRole(
  currentUserId: string,
  membershipId: string,
  input: UpdateOrganizationUserRoleInput,
): Promise<UpdateOrganizationUserRoleResult> {
  const currentMembership =
    await getCurrentOrganizationMembership(currentUserId);

  if (!currentMembership) {
    return { status: "organization_not_found" };
  }

  if (!canManageOrganization(currentMembership.role)) {
    return { status: "forbidden" };
  }

  const [targetMembership] = await db
    .select({
      id: organizationUsers.id,
      organizationId: organizationUsers.organizationId,
      userId: organizationUsers.userId,
      role: organizationUsers.role,
      status: organizationUsers.status,
      createdAt: organizationUsers.createdAt,
      updatedAt: organizationUsers.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      },
    })
    .from(organizationUsers)
    .innerJoin(user, eq(organizationUsers.userId, user.id))
    .where(
      and(
        eq(organizationUsers.id, membershipId),
        eq(organizationUsers.organizationId, currentMembership.organization.id),
      ),
    )
    .limit(1);

  if (!targetMembership) {
    return { status: "membership_not_found" };
  }

  if (targetMembership.role === "owner" && input.role !== "owner") {
    const owners = await db
      .select({ id: organizationUsers.id })
      .from(organizationUsers)
      .where(
        and(
          eq(organizationUsers.organizationId, currentMembership.organization.id),
          eq(organizationUsers.role, "owner"),
          eq(organizationUsers.status, "active"),
        ),
      );

    if (owners.length === 1) {
      return { status: "last_owner" };
    }
  }

  const [organizationUser] = await db
    .update(organizationUsers)
    .set({
      role: input.role,
    })
    .where(eq(organizationUsers.id, membershipId))
    .returning({
      id: organizationUsers.id,
      organizationId: organizationUsers.organizationId,
      userId: organizationUsers.userId,
      role: organizationUsers.role,
      status: organizationUsers.status,
      createdAt: organizationUsers.createdAt,
      updatedAt: organizationUsers.updatedAt,
    });

  if (!organizationUser) {
    throw new Error("Organization membership update failed");
  }

  return {
    status: "updated",
    organizationUser: {
      ...organizationUser,
      user: targetMembership.user,
    },
  };
}
