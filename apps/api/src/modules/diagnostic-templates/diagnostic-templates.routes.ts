import type { FastifyInstance } from "fastify";

import { requireAuth, requireRole } from "../../auth/guards.js";
import {
  createDiagnosticTemplateAreaController,
  createDiagnosticTemplateController,
  createDiagnosticTemplateQuestionController,
  getDiagnosticTemplateByIdController,
  listDiagnosticTemplatesController,
} from "./diagnostic-templates.controller.js";

export async function diagnosticTemplatesRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.get(
    "/diagnostic-templates",
    {
      preHandler: requireAuth,
    },
    listDiagnosticTemplatesController,
  );
  server.get(
    "/diagnostic-templates/:id",
    {
      preHandler: requireAuth,
    },
    getDiagnosticTemplateByIdController,
  );
  server.post(
    "/diagnostic-templates",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createDiagnosticTemplateController,
  );
  server.post(
    "/diagnostic-templates/:id/areas",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createDiagnosticTemplateAreaController,
  );
  server.post(
    "/diagnostic-template-areas/:id/questions",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createDiagnosticTemplateQuestionController,
  );
}
