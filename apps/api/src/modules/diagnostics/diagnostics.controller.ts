import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  companyDiagnosticsParamsSchema,
  createDiagnosticSchema,
  diagnosticParamsSchema,
} from "./diagnostics.schemas.js";
import {
  createDiagnostic,
  getDiagnosticById,
  listDiagnosticsByCompany,
} from "./diagnostics.service.js";

export async function createDiagnosticController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createDiagnosticSchema.parse(request.body);
  const diagnostic = await createDiagnostic(currentUser.id, input);

  if (!diagnostic) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.status(201).send({
    data: diagnostic,
  });
}

export async function getDiagnosticByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = diagnosticParamsSchema.parse(request.params);
  const diagnostic = await getDiagnosticById(currentUser.id, id);

  if (!diagnostic) {
    return reply.status(404).send({
      error: {
        message: "Diagnostic not found",
        code: "DIAGNOSTIC_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: diagnostic,
  });
}

export async function listDiagnosticsByCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { companyId } = companyDiagnosticsParamsSchema.parse(request.params);
  const diagnostics = await listDiagnosticsByCompany(currentUser.id, companyId);

  if (!diagnostics) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: diagnostics,
  });
}
