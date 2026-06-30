import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  baselineDiagnosticAnswerParamsSchema,
  baselineDiagnosticParamsSchema,
  createBaselineDiagnosticAnswerSchema,
  createBaselineDiagnosticSchema,
  updateBaselineDiagnosticAnswerSchema,
} from "./baseline-diagnostics.schemas.js";
import {
  completeBaselineDiagnostic,
  createBaselineDiagnostic,
  createBaselineDiagnosticAnswer,
  deleteBaselineDiagnosticAnswer,
  getBaselineDiagnosticById,
  getBaselineDiagnosticScores,
  listBaselineDiagnosticAnswers,
  listBaselineDiagnosticsByOrganization,
  updateBaselineDiagnosticAnswer,
} from "./baseline-diagnostics.service.js";

export async function createBaselineDiagnosticController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createBaselineDiagnosticSchema.parse(request.body);
  const result = await createBaselineDiagnostic(currentUser.id, input);

  if (result.status === "created") {
    return reply.status(201).send({ data: result.diagnostic });
  }

  if (result.status === "organization_not_found") {
    return reply.status(404).send({
      error: {
        message: "Organization not found",
        code: "ORGANIZATION_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Organization baseline is not configured yet",
      code: "ORGANIZATION_BASELINE_NOT_CONFIGURED",
    },
  });
}

export async function listBaselineDiagnosticsByOrganizationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const diagnostics = await listBaselineDiagnosticsByOrganization(currentUser.id);

  if (!diagnostics) {
    return reply.status(404).send({
      error: {
        message: "Organization not found",
        code: "ORGANIZATION_NOT_FOUND",
      },
    });
  }

  return reply.send({ data: diagnostics });
}

export async function getBaselineDiagnosticByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = baselineDiagnosticParamsSchema.parse(request.params);
  const diagnostic = await getBaselineDiagnosticById(currentUser.id, id);

  if (!diagnostic) {
    return reply.status(404).send({
      error: {
        message: "Baseline diagnostic not found",
        code: "BASELINE_DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  return reply.send({ data: diagnostic });
}

export async function createBaselineDiagnosticAnswerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = baselineDiagnosticParamsSchema.parse(request.params);
  const input = createBaselineDiagnosticAnswerSchema.parse(request.body);
  const result = await createBaselineDiagnosticAnswer(currentUser.id, id, input);

  if (result.status === "created") {
    return reply.status(201).send({ data: result.answer });
  }

  if (result.status === "diagnostic_not_found") {
    return reply.status(404).send({
      error: {
        message: "Baseline diagnostic not found",
        code: "BASELINE_DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  if (result.status === "diagnostic_completed") {
    return reply.status(409).send({
      error: {
        message: "Baseline diagnostic is already completed",
        code: "BASELINE_DIAGNOSTIC_ALREADY_COMPLETED",
      },
    });
  }

  if (result.status === "question_not_found") {
    return reply.status(404).send({
      error: {
        message: "Baseline question not found",
        code: "BASELINE_QUESTION_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Baseline diagnostic answer already exists",
      code: "BASELINE_DIAGNOSTIC_ANSWER_ALREADY_EXISTS",
    },
  });
}

export async function listBaselineDiagnosticAnswersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = baselineDiagnosticParamsSchema.parse(request.params);
  const answers = await listBaselineDiagnosticAnswers(currentUser.id, id);

  if (!answers) {
    return reply.status(404).send({
      error: {
        message: "Baseline diagnostic not found",
        code: "BASELINE_DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  return reply.send({ data: answers });
}

export async function updateBaselineDiagnosticAnswerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = baselineDiagnosticAnswerParamsSchema.parse(request.params);
  const input = updateBaselineDiagnosticAnswerSchema.parse(request.body);
  const result = await updateBaselineDiagnosticAnswer(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({ data: result.answer });
  }

  if (result.status === "answer_not_found") {
    return reply.status(404).send({
      error: {
        message: "Baseline diagnostic answer not found",
        code: "BASELINE_DIAGNOSTIC_ANSWER_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Baseline diagnostic is already completed",
      code: "BASELINE_DIAGNOSTIC_ALREADY_COMPLETED",
    },
  });
}

export async function deleteBaselineDiagnosticAnswerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = baselineDiagnosticAnswerParamsSchema.parse(request.params);
  const result = await deleteBaselineDiagnosticAnswer(currentUser.id, id);

  if (result.status === "deleted") {
    return reply.send({ data: result.answer });
  }

  if (result.status === "answer_not_found") {
    return reply.status(404).send({
      error: {
        message: "Baseline diagnostic answer not found",
        code: "BASELINE_DIAGNOSTIC_ANSWER_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Baseline diagnostic is already completed",
      code: "BASELINE_DIAGNOSTIC_ALREADY_COMPLETED",
    },
  });
}

export async function completeBaselineDiagnosticController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = baselineDiagnosticParamsSchema.parse(request.params);
  const result = await completeBaselineDiagnostic(currentUser.id, id);

  if (result.status === "completed") {
    return reply.send({ data: result.summary });
  }

  if (result.status === "diagnostic_not_found") {
    return reply.status(404).send({
      error: {
        message: "Baseline diagnostic not found",
        code: "BASELINE_DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  if (result.status === "diagnostic_completed") {
    return reply.status(409).send({
      error: {
        message: "Baseline diagnostic is already completed",
        code: "BASELINE_DIAGNOSTIC_ALREADY_COMPLETED",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Baseline diagnostic has no answers to score",
      code: "BASELINE_DIAGNOSTIC_INSUFFICIENT_ANSWERS",
    },
  });
}

export async function getBaselineDiagnosticScoresController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = baselineDiagnosticParamsSchema.parse(request.params);
  const result = await getBaselineDiagnosticScores(currentUser.id, id);

  if (result.status === "found") {
    return reply.send({ data: result.summary });
  }

  if (result.status === "diagnostic_not_found") {
    return reply.status(404).send({
      error: {
        message: "Baseline diagnostic not found",
        code: "BASELINE_DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Baseline diagnostic scores are not available yet",
      code: "BASELINE_DIAGNOSTIC_NOT_COMPLETED",
    },
  });
}
