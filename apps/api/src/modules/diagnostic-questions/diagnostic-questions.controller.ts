import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createDiagnosticQuestionSchema,
  diagnosticAreaParamsSchema,
} from "./diagnostic-questions.schemas.js";
import {
  createDiagnosticQuestion,
  listDiagnosticAreasWithQuestions,
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
