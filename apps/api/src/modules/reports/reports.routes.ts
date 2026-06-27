import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  createDiagnosticExcelReportController,
  createDiagnosticPdfReportController,
  getReportByIdController,
} from "./reports.controller.js";

export async function reportsRoutes(server: FastifyInstance): Promise<void> {
  server.post(
    "/reports/diagnostic/:diagnosticId/pdf",
    {
      preHandler: requireAuth,
    },
    createDiagnosticPdfReportController,
  );
  server.post(
    "/reports/diagnostic/:diagnosticId/excel",
    {
      preHandler: requireAuth,
    },
    createDiagnosticExcelReportController,
  );
  server.get(
    "/reports/:id",
    {
      preHandler: requireAuth,
    },
    getReportByIdController,
  );
}
