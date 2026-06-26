import type { FastifyInstance } from "fastify";

import { requireAuth, requireRole } from "../../auth/guards.js";
import {
  applyTemplateToCompanyController,
  createCompanyDiagnosticAreaController,
  createCompanyDiagnosticQuestionController,
  deleteCompanyDiagnosticAreaController,
  deleteCompanyDiagnosticQuestionController,
  getCompanyDiagnosticAreaByIdController,
  listCompanyDiagnosticAreasController,
  updateCompanyDiagnosticAreaController,
  updateCompanyDiagnosticQuestionController,
} from "./company-diagnostic-areas.controller.js";

export async function companyDiagnosticAreasRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.post(
    "/companies/:companyId/diagnostic-setup/from-template",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    applyTemplateToCompanyController,
  );
  server.get(
    "/companies/:companyId/diagnostic-areas",
    {
      preHandler: requireAuth,
    },
    listCompanyDiagnosticAreasController,
  );
  server.get(
    "/company-diagnostic-areas/:id",
    {
      preHandler: requireAuth,
    },
    getCompanyDiagnosticAreaByIdController,
  );
  server.post(
    "/companies/:companyId/diagnostic-areas",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createCompanyDiagnosticAreaController,
  );
  server.post(
    "/company-diagnostic-areas/:id/questions",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createCompanyDiagnosticQuestionController,
  );
  server.patch(
    "/company-diagnostic-areas/:id",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    updateCompanyDiagnosticAreaController,
  );
  server.delete(
    "/company-diagnostic-areas/:id",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    deleteCompanyDiagnosticAreaController,
  );
  server.patch(
    "/company-diagnostic-questions/:id",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    updateCompanyDiagnosticQuestionController,
  );
  server.delete(
    "/company-diagnostic-questions/:id",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    deleteCompanyDiagnosticQuestionController,
  );
}
