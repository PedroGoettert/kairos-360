import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  createDiagnosticAnswerController,
  createDiagnosticController,
  getDiagnosticByIdController,
  listDiagnosticAnswersController,
  listDiagnosticsByCompanyController,
  updateDiagnosticAnswerController,
} from "./diagnostics.controller.js";

export async function diagnosticsRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.post(
    "/diagnostics",
    {
      preHandler: requireAuth,
    },
    createDiagnosticController,
  );
  server.get(
    "/diagnostics/:id",
    {
      preHandler: requireAuth,
    },
    getDiagnosticByIdController,
  );
  server.post(
    "/diagnostics/:id/answers",
    {
      preHandler: requireAuth,
    },
    createDiagnosticAnswerController,
  );
  server.get(
    "/diagnostics/:id/answers",
    {
      preHandler: requireAuth,
    },
    listDiagnosticAnswersController,
  );
  server.patch(
    "/diagnostic-answers/:id",
    {
      preHandler: requireAuth,
    },
    updateDiagnosticAnswerController,
  );
  server.get(
    "/companies/:companyId/diagnostics",
    {
      preHandler: requireAuth,
    },
    listDiagnosticsByCompanyController,
  );
}
