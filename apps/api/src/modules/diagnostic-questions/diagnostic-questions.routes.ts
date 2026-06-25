import type { FastifyInstance } from "fastify";

import { requireAuth, requireRole } from "../../auth/guards.js";
import {
  createDiagnosticQuestionController,
  listDiagnosticAreasWithQuestionsController,
} from "./diagnostic-questions.controller.js";

export async function diagnosticQuestionsRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.get(
    "/diagnostic-areas",
    {
      preHandler: requireAuth,
    },
    listDiagnosticAreasWithQuestionsController,
  );
  server.post(
    "/diagnostic-areas/:areaId/questions",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createDiagnosticQuestionController,
  );
}
