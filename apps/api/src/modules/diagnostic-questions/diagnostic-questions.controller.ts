import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createDiagnosticQuestionSchema,
  diagnosticAreaParamsSchema,
  diagnosticQuestionParamsSchema,
  updateDiagnosticQuestionSchema,
  updateDiagnosticQuestionStatusSchema,
} from "./diagnostic-questions.schemas.js";
import {
  createDiagnosticQuestion,
  listDiagnosticAreasWithQuestions,
  updateDiagnosticQuestion,
  updateDiagnosticQuestionStatus,
} from "./diagnostic-questions.service.js";

export async function listDiagnosticAreasWithQuestionsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const areas = await listDiagnosticAreasWithQuestions();

  return reply.send({
    data: areas,
  });
}

export async function createDiagnosticQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { areaId } = diagnosticAreaParamsSchema.parse(request.params);
  const input = createDiagnosticQuestionSchema.parse(request.body);
  const result = await createDiagnosticQuestion(areaId, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.question,
    });
  }

  if (result.status === "area_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic area not found",
        code: "DIAGNOSTIC_AREA_NOT_FOUND",
      },
    });
  }

  if (result.status === "question_already_exists") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic question already exists",
        code: "DIAGNOSTIC_QUESTION_ALREADY_EXISTS",
      },
    });
  }
}

export async function updateDiagnosticQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = diagnosticQuestionParamsSchema.parse(request.params);
  const input = updateDiagnosticQuestionSchema.parse(request.body);
  const result = await updateDiagnosticQuestion(id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.question,
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

  if (result.status === "question_already_exists") {
    return reply.status(409).send({
      error: {
        message: "Diagnostic question already exists",
        code: "DIAGNOSTIC_QUESTION_ALREADY_EXISTS",
      },
    });
  }
}

export async function updateDiagnosticQuestionStatusController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = diagnosticQuestionParamsSchema.parse(request.params);
  const input = updateDiagnosticQuestionStatusSchema.parse(request.body);
  const result = await updateDiagnosticQuestionStatus(id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.question,
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
}
