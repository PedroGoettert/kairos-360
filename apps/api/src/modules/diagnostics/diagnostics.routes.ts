import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  createDiagnosticController,
  getDiagnosticByIdController,
  listDiagnosticsByCompanyController,
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
  server.get(
    "/companies/:companyId/diagnostics",
    {
      preHandler: requireAuth,
    },
    listDiagnosticsByCompanyController,
  );
}
