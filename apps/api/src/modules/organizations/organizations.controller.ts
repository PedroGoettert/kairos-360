import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  createOrganizationSchema,
  createOrganizationUserSchema,
  organizationUserParamsSchema,
  updateOrganizationSchema,
  updateOrganizationUserRoleSchema,
} from "./organizations.schemas.js";
import {
  createOrganization,
  createOrganizationUser,
  getCurrentOrganization,
  listCurrentOrganizationUsers,
  updateCurrentOrganization,
  updateOrganizationUserRole,
} from "./organizations.service.js";

export async function createOrganizationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createOrganizationSchema.parse(request.body);
  const result = await createOrganization(currentUser.id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.organization,
    });
  }

  if (result.status === "slug_already_exists") {
    return reply.status(409).send({
      error: {
        message: "Organization slug already exists",
        code: "ORGANIZATION_SLUG_ALREADY_EXISTS",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "User already belongs to an organization",
      code: "USER_ALREADY_HAS_ORGANIZATION",
    },
  });
}

export async function getCurrentOrganizationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const organization = await getCurrentOrganization(currentUser.id);

  if (!organization) {
    return reply.status(404).send({
      error: {
        message: "Organization not found",
        code: "ORGANIZATION_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: organization,
  });
}

export async function updateCurrentOrganizationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = updateOrganizationSchema.parse(request.body);
  const result = await updateCurrentOrganization(currentUser.id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.organization,
    });
  }

  if (result.status === "organization_not_found") {
    return reply.status(404).send({
      error: {
        message: "Organization not found",
        code: "ORGANIZATION_NOT_FOUND",
      },
    });
  }

  if (result.status === "slug_already_exists") {
    return reply.status(409).send({
      error: {
        message: "Organization slug already exists",
        code: "ORGANIZATION_SLUG_ALREADY_EXISTS",
      },
    });
  }

  return reply.status(403).send({
    error: {
      message: "Forbidden",
      code: "FORBIDDEN",
    },
  });
}

export async function listCurrentOrganizationUsersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const organizationUsers = await listCurrentOrganizationUsers(currentUser.id);

  if (!organizationUsers) {
    return reply.status(404).send({
      error: {
        message: "Organization not found",
        code: "ORGANIZATION_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: organizationUsers,
  });
}

export async function createOrganizationUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createOrganizationUserSchema.parse(request.body);
  const result = await createOrganizationUser(currentUser.id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.organizationUser,
    });
  }

  const errors = {
    organization_not_found: {
      status: 404,
      message: "Organization not found",
      code: "ORGANIZATION_NOT_FOUND",
    },
    forbidden: {
      status: 403,
      message: "Forbidden",
      code: "FORBIDDEN",
    },
    user_not_found: {
      status: 404,
      message: "User not found",
      code: "USER_NOT_FOUND",
    },
    membership_already_exists: {
      status: 409,
      message: "User already belongs to organization",
      code: "ORGANIZATION_USER_ALREADY_EXISTS",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({
    error: {
      message: error.message,
      code: error.code,
    },
  });
}

export async function updateOrganizationUserRoleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = organizationUserParamsSchema.parse(request.params);
  const input = updateOrganizationUserRoleSchema.parse(request.body);
  const result = await updateOrganizationUserRole(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.organizationUser,
    });
  }

  const errors = {
    organization_not_found: {
      status: 404,
      message: "Organization not found",
      code: "ORGANIZATION_NOT_FOUND",
    },
    forbidden: {
      status: 403,
      message: "Forbidden",
      code: "FORBIDDEN",
    },
    membership_not_found: {
      status: 404,
      message: "Organization user not found",
      code: "ORGANIZATION_USER_NOT_FOUND",
    },
    last_owner: {
      status: 409,
      message: "Organization must keep at least one owner",
      code: "LAST_OWNER_CONSTRAINT",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({
    error: {
      message: error.message,
      code: error.code,
    },
  });
}
