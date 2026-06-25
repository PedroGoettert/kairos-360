import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  companyDiagnosticsParamsSchema,
  createDiagnosticAnswerSchema,
  createDiagnosticSchema,
  diagnosticAnswerParamsSchema,
  diagnosticParamsSchema,
  updateDiagnosticAnswerSchema,
} from "./diagnostics.schemas.js";
import {
  completeDiagnostic,
  createDiagnosticAnswer,
  createDiagnostic,
  deleteDiagnosticAnswer,
  getDiagnosticById,
  getDiagnosticScores,
  listDiagnosticAnswers,
  listDiagnosticsByCompany,
  updateDiagnosticAnswer,
} from "./diagnostics.service.js";

export async function createDiagnosticController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createDiagnosticSchema.parse(request.body);
  const diagnostic = await createDiagnostic(currentUser.id, input);

  if (!diagnostic) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.status(201).send({
    data: diagnostic,
  });
}

export async function getDiagnosticByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticParamsSchema.parse(request.params);
  const diagnostic = await getDiagnosticById(currentUser.id, id);

  if (!diagnostic) {
    return reply.status(404).send({
      error: {
        message: "Diagnostic not found",
        code: "DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: diagnostic,
  });
}

export async function listDiagnosticsByCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { companyId } = companyDiagnosticsParamsSchema.parse(request.params);
  const diagnostics = await listDiagnosticsByCompany(currentUser.id, companyId);

  if (!diagnostics) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: diagnostics,
  });
}

export async function createDiagnosticAnswerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticParamsSchema.parse(request.params);
  const input = createDiagnosticAnswerSchema.parse(request.body);
  const result = await createDiagnosticAnswer(currentUser.id, id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.answer,
    });
  }

  if (result.status === "diagnostic_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic not found",
        code: "DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  if (result.status === "diagnostic_completed") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic is already completed",
        code: "DIAGNOSTIC_ALREADY_COMPLETED",
      },
    });
  }

  if (result.status === "question_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic question not found",
        code: "DIAGNOSTIC_QUESTION_NOT_FOUND",
      },
    });
  }

  if (result.status === "answer_already_exists") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic answer already exists",
        code: "DIAGNOSTIC_ANSWER_ALREADY_EXISTS",
      },
    });
  }
}

export async function listDiagnosticAnswersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticParamsSchema.parse(request.params);
  const answers = await listDiagnosticAnswers(currentUser.id, id);

  if (!answers) {
    return reply.status(404).send({
      error: {
        message: "Diagnostic not found",
        code: "DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: answers,
  });
}

export async function updateDiagnosticAnswerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticAnswerParamsSchema.parse(request.params);
  const input = updateDiagnosticAnswerSchema.parse(request.body);
  const result = await updateDiagnosticAnswer(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.answer,
    });
  }

  if (result.status === "answer_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic answer not found",
        code: "DIAGNOSTIC_ANSWER_NOT_FOUND",
      },
    });
  }

  if (result.status === "diagnostic_completed") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic is already completed",
        code: "DIAGNOSTIC_ALREADY_COMPLETED",
      },
    });
  }
}

export async function deleteDiagnosticAnswerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticAnswerParamsSchema.parse(request.params);
  const result = await deleteDiagnosticAnswer(currentUser.id, id);

  if (result.status === "deleted") {
    return reply.send({
      data: result.answer,
    });
  }

  if (result.status === "answer_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic answer not found",
        code: "DIAGNOSTIC_ANSWER_NOT_FOUND",
      },
    });
  }

  if (result.status === "diagnostic_completed") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic is already completed",
        code: "DIAGNOSTIC_ALREADY_COMPLETED",
      },
    });
  }
}

export async function completeDiagnosticController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticParamsSchema.parse(request.params);
  const result = await completeDiagnostic(currentUser.id, id);

  if (result.status === "completed") {
    return reply.send({
      data: result.summary,
    });
  }

  if (result.status === "diagnostic_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic not found",
        code: "DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  if (result.status === "diagnostic_completed") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic is already completed",
        code: "DIAGNOSTIC_ALREADY_COMPLETED",
      },
    });
  }

  if (result.status === "insufficient_answers") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic has no answers to score",
        code: "DIAGNOSTIC_INSUFFICIENT_ANSWERS",
      },
    });
  }
}

export async function getDiagnosticScoresController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticParamsSchema.parse(request.params);
  const result = await getDiagnosticScores(currentUser.id, id);

  if (result.status === "found") {
    return reply.send({
      data: result.summary,
    });
  }

  if (result.status === "diagnostic_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic not found",
        code: "DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  if (result.status === "diagnostic_not_completed") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic scores are not available yet",
        code: "DIAGNOSTIC_NOT_COMPLETED",
      },
    });
  }
}
