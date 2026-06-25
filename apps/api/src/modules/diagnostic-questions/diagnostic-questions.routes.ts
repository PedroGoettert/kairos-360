import type { FastifyInstance } from "fastify";

import { requireAuth, requireRole } from "../../auth/guards.js";
import {
  createDiagnosticQuestionController,
  getDiagnosticAreaByIdController,
  listDiagnosticAreasWithQuestionsController,
  updateDiagnosticQuestionController,
  updateDiagnosticQuestionStatusController,
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
  server.get(
    "/diagnostic-areas/:areaId",
    {
      preHandler: requireAuth,
    },
    getDiagnosticAreaByIdController,
  );
  server.post(
    "/diagnostic-areas/:areaId/questions",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createDiagnosticQuestionController,
  );
  server.patch(
    "/diagnostic-questions/:id",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    updateDiagnosticQuestionController,
  );
  server.patch(
    "/diagnostic-questions/:id/status",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    updateDiagnosticQuestionStatusController,
  );
}
