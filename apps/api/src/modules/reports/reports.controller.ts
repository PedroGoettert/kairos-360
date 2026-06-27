import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  diagnosticReportParamsSchema,
  reportParamsSchema,
} from "./reports.schemas.js";
import {
  createManualDiagnosticReport,
  getReportById,
} from "./reports.service.js";

async function createManualDiagnosticReportController(
  request: FastifyRequest,
  reply: FastifyReply,
  format: "pdf" | "excel",
) {
  const currentUser = getRequiredCurrentUser(request);
  const { diagnosticId } = diagnosticReportParamsSchema.parse(request.params);
  const result = await createManualDiagnosticReport(
    currentUser.id,
    diagnosticId,
    format,
  );

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.report,
    });
  }

  if (result.status === "diagnostic_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic not found",
        code: "DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Diagnostic must be completed before generating report",
      code: "DIAGNOSTIC_NOT_COMPLETED",
    },
  });
}

export async function createDiagnosticPdfReportController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return createManualDiagnosticReportController(request, reply, "pdf");
}

export async function createDiagnosticExcelReportController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return createManualDiagnosticReportController(request, reply, "excel");
}

export async function getReportByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = reportParamsSchema.parse(request.params);
  const report = await getReportById(currentUser.id, id);

  if (!report) {
    return reply.status(404).send({
      error: {
        message: "Report not found",
        code: "REPORT_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: report,
  });
}
