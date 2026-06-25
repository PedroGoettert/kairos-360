import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import { listDiagnosticAreasWithQuestionsController } from "./diagnostic-questions.controller.js";

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
}
