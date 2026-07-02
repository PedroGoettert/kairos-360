import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  createManualMetricSchema,
  manualMetricParamsSchema,
  updateManualMetricSchema,
} from "./manual-metrics.schemas.js";
import {
  createManualMetric,
  deleteManualMetric,
  getManualMetricById,
  listManualMetrics,
  updateManualMetric,
} from "./manual-metrics.service.js";

export async function createManualMetricController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createManualMetricSchema.parse(request.body);
  const result = await createManualMetric(currentUser.id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.manualMetric,
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
  } as const;

  const error = errors[result.status];
  return reply.status(error.status).send({
    error: {
      message: error.message,
      code: error.code,
    },
  });
}

export async function listManualMetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const result = await listManualMetrics(currentUser.id);

  if (result.status === "found") {
    return reply.send({
      data: result.manualMetrics,
    });
  }

  return reply.status(404).send({
    error: {
      message: "Organization not found",
      code: "ORGANIZATION_NOT_FOUND",
    },
  });
}

export async function getManualMetricByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = manualMetricParamsSchema.parse(request.params);
  const result = await getManualMetricById(currentUser.id, id);

  if (result.status === "found") {
    return reply.send({
      data: result.manualMetric,
    });
  }

  const errors = {
    organization_not_found: {
      status: 404,
      message: "Organization not found",
      code: "ORGANIZATION_NOT_FOUND",
    },
    manual_metric_not_found: {
      status: 404,
      message: "Manual metric not found",
      code: "MANUAL_METRIC_NOT_FOUND",
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

export async function updateManualMetricController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = manualMetricParamsSchema.parse(request.params);
  const input = updateManualMetricSchema.parse(request.body);
  const result = await updateManualMetric(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.manualMetric,
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
    manual_metric_not_found: {
      status: 404,
      message: "Manual metric not found",
      code: "MANUAL_METRIC_NOT_FOUND",
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

export async function deleteManualMetricController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = manualMetricParamsSchema.parse(request.params);
  const result = await deleteManualMetric(currentUser.id, id);

  if (result.status === "deleted") {
    return reply.send({
      data: result.manualMetric,
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
    manual_metric_not_found: {
      status: 404,
      message: "Manual metric not found",
      code: "MANUAL_METRIC_NOT_FOUND",
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
