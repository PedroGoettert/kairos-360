import type { FastifyReply, FastifyRequest } from "fastify";

import { listDiagnosticAreasWithQuestions } from "./diagnostic-questions.service.js";

export async function listDiagnosticAreasWithQuestionsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const areas = await listDiagnosticAreasWithQuestions();

  return reply.send({
    data: areas,
  });
}
