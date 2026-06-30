import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  completeBaselineDiagnosticController,
  createBaselineDiagnosticAnswerController,
  createBaselineDiagnosticController,
  deleteBaselineDiagnosticAnswerController,
  getBaselineDiagnosticByIdController,
  getBaselineDiagnosticScoresController,
  listBaselineDiagnosticAnswersController,
  listBaselineDiagnosticsByOrganizationController,
  updateBaselineDiagnosticAnswerController,
} from "./baseline-diagnostics.controller.js";

export async function baselineDiagnosticsRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.post(
    "/baseline-diagnostics",
    { preHandler: requireAuth },
    createBaselineDiagnosticController,
  );
  server.get(
    "/baseline-diagnostics/:id",
    { preHandler: requireAuth },
    getBaselineDiagnosticByIdController,
  );
  server.get(
    "/organization/baseline-diagnostics",
    { preHandler: requireAuth },
    listBaselineDiagnosticsByOrganizationController,
  );
  server.post(
    "/baseline-diagnostics/:id/answers",
    { preHandler: requireAuth },
    createBaselineDiagnosticAnswerController,
  );
  server.get(
    "/baseline-diagnostics/:id/answers",
    { preHandler: requireAuth },
    listBaselineDiagnosticAnswersController,
  );
  server.post(
    "/baseline-diagnostics/:id/complete",
    { preHandler: requireAuth },
    completeBaselineDiagnosticController,
  );
  server.get(
    "/baseline-diagnostics/:id/scores",
    { preHandler: requireAuth },
    getBaselineDiagnosticScoresController,
  );
  server.patch(
    "/baseline-diagnostic-answers/:id",
    { preHandler: requireAuth },
    updateBaselineDiagnosticAnswerController,
  );
  server.delete(
    "/baseline-diagnostic-answers/:id",
    { preHandler: requireAuth },
    deleteBaselineDiagnosticAnswerController,
  );
}
