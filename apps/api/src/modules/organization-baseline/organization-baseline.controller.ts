import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  applyTemplateToOrganizationSchema,
  createOrganizationBaselineAreaSchema,
  createOrganizationBaselineQuestionSchema,
  organizationBaselineAreaParamsSchema,
  organizationBaselineQuestionParamsSchema,
  updateOrganizationBaselineAreaSchema,
  updateOrganizationBaselineQuestionSchema,
} from "./organization-baseline.schemas.js";
import {
  applyTemplateToOrganization,
  createOrganizationBaselineArea,
  createOrganizationBaselineQuestion,
  deleteOrganizationBaselineArea,
  deleteOrganizationBaselineQuestion,
  getOrganizationBaselineAreaById,
  listOrganizationBaselineAreas,
  updateOrganizationBaselineArea,
  updateOrganizationBaselineQuestion,
} from "./organization-baseline.service.js";

export async function listOrganizationBaselineAreasController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const result = await listOrganizationBaselineAreas(currentUser.id);

  if (result.status === "found") {
    return reply.send({ data: result.areas });
  }

  return reply.status(404).send({
    error: { message: "Organization not found", code: "ORGANIZATION_NOT_FOUND" },
  });
}

export async function getOrganizationBaselineAreaByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = organizationBaselineAreaParamsSchema.parse(request.params);
  const result = await getOrganizationBaselineAreaById(currentUser.id, id);

  if (result.status === "found") {
    return reply.send({ data: result.area });
  }

  return reply.status(404).send({
    error: {
      message: "Organization baseline area not found",
      code: "ORGANIZATION_BASELINE_AREA_NOT_FOUND",
    },
  });
}

export async function applyTemplateToOrganizationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = applyTemplateToOrganizationSchema.parse(request.body);
  const result = await applyTemplateToOrganization(currentUser.id, input);

  if (result.status === "created") {
    return reply.status(201).send({ data: result.areas });
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
    template_not_found: {
      status: 404,
      message: "Baseline template not found",
      code: "BASELINE_TEMPLATE_NOT_FOUND",
    },
    setup_already_exists: {
      status: 409,
      message: "Organization baseline setup already exists",
      code: "ORGANIZATION_BASELINE_SETUP_ALREADY_EXISTS",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({ error });
}

export async function createOrganizationBaselineAreaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createOrganizationBaselineAreaSchema.parse(request.body);
  const result = await createOrganizationBaselineArea(currentUser.id, input);

  if (result.status === "created") {
    return reply.status(201).send({ data: result.area });
  }

  const errors = {
    organization_not_found: {
      status: 404,
      message: "Organization not found",
      code: "ORGANIZATION_NOT_FOUND",
    },
    forbidden: { status: 403, message: "Forbidden", code: "FORBIDDEN" },
    area_already_exists: {
      status: 409,
      message: "Organization baseline area already exists",
      code: "ORGANIZATION_BASELINE_AREA_ALREADY_EXISTS",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({ error });
}

export async function createOrganizationBaselineQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = organizationBaselineAreaParamsSchema.parse(request.params);
  const input = createOrganizationBaselineQuestionSchema.parse(request.body);
  const result = await createOrganizationBaselineQuestion(currentUser.id, id, input);

  if (result.status === "created") {
    return reply.status(201).send({ data: result.question });
  }

  const errors = {
    forbidden: { status: 403, message: "Forbidden", code: "FORBIDDEN" },
    area_not_found: {
      status: 404,
      message: "Organization baseline area not found",
      code: "ORGANIZATION_BASELINE_AREA_NOT_FOUND",
    },
    question_already_exists: {
      status: 409,
      message: "Organization baseline question already exists",
      code: "ORGANIZATION_BASELINE_QUESTION_ALREADY_EXISTS",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({ error });
}

export async function updateOrganizationBaselineAreaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = organizationBaselineAreaParamsSchema.parse(request.params);
  const input = updateOrganizationBaselineAreaSchema.parse(request.body);
  const result = await updateOrganizationBaselineArea(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({ data: result.area });
  }

  const errors = {
    forbidden: { status: 403, message: "Forbidden", code: "FORBIDDEN" },
    area_not_found: {
      status: 404,
      message: "Organization baseline area not found",
      code: "ORGANIZATION_BASELINE_AREA_NOT_FOUND",
    },
    slug_already_exists: {
      status: 409,
      message: "Organization baseline area slug already exists",
      code: "ORGANIZATION_BASELINE_AREA_SLUG_ALREADY_EXISTS",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({ error });
}

export async function deleteOrganizationBaselineAreaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = organizationBaselineAreaParamsSchema.parse(request.params);
  const result = await deleteOrganizationBaselineArea(currentUser.id, id);

  if (result.status === "deactivated") {
    return reply.send({
      data: { message: "Organization baseline area has been deactivated" },
    });
  }

  const errors = {
    forbidden: { status: 403, message: "Forbidden", code: "FORBIDDEN" },
    area_not_found: {
      status: 404,
      message: "Organization baseline area not found",
      code: "ORGANIZATION_BASELINE_AREA_NOT_FOUND",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({ error });
}

export async function updateOrganizationBaselineQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = organizationBaselineQuestionParamsSchema.parse(request.params);
  const input = updateOrganizationBaselineQuestionSchema.parse(request.body);
  const result = await updateOrganizationBaselineQuestion(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({ data: result.question });
  }

  const errors = {
    forbidden: { status: 403, message: "Forbidden", code: "FORBIDDEN" },
    question_not_found: {
      status: 404,
      message: "Organization baseline question not found",
      code: "ORGANIZATION_BASELINE_QUESTION_NOT_FOUND",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({ error });
}

export async function deleteOrganizationBaselineQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = organizationBaselineQuestionParamsSchema.parse(request.params);
  const result = await deleteOrganizationBaselineQuestion(currentUser.id, id);

  if (result.status === "deleted") {
    return reply.status(204).send();
  }

  if (result.status === "deactivated") {
    return reply.send({
      data: {
        message: "Organization baseline question has been deactivated due to existing answers",
      },
    });
  }

  const errors = {
    forbidden: { status: 403, message: "Forbidden", code: "FORBIDDEN" },
    question_not_found: {
      status: 404,
      message: "Organization baseline question not found",
      code: "ORGANIZATION_BASELINE_QUESTION_NOT_FOUND",
    },
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({ error });
}
