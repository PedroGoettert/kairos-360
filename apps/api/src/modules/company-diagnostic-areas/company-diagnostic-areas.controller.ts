import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  applyTemplateToCompanySchema,
  companyDiagnosticAreaParamsSchema,
  companyDiagnosticAreasCompanyParamsSchema,
  createCompanyDiagnosticAreaSchema,
  createCompanyDiagnosticQuestionSchema,
  updateCompanyDiagnosticAreaSchema,
  updateCompanyDiagnosticQuestionSchema,
} from "./company-diagnostic-areas.schemas.js";
import {
  applyTemplateToCompany,
  createCompanyDiagnosticArea,
  createCompanyDiagnosticQuestion,
  deleteCompanyDiagnosticArea,
  deleteCompanyDiagnosticQuestion,
  getCompanyDiagnosticAreaById,
  listCompanyDiagnosticAreas,
  updateCompanyDiagnosticArea,
  updateCompanyDiagnosticQuestion,
} from "./company-diagnostic-areas.service.js";

export async function listCompanyDiagnosticAreasController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { companyId } = companyDiagnosticAreasCompanyParamsSchema.parse(
    request.params,
  );
  const result = await listCompanyDiagnosticAreas(currentUser.id, companyId);

  if (result.status === "found") {
    return reply.send({
      data: result.areas,
    });
  }

  return reply.status(404).send({
    error: {
      message: "Company not found",
      code: "COMPANY_NOT_FOUND",
    },
  });
}

export async function getCompanyDiagnosticAreaByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyDiagnosticAreaParamsSchema.parse(request.params);
  const result = await getCompanyDiagnosticAreaById(currentUser.id, id);

  if (result.status === "found") {
    return reply.send({
      data: result.area,
    });
  }

  return reply.status(404).send({
    error: {
      message: "Company diagnostic area not found",
      code: "COMPANY_DIAGNOSTIC_AREA_NOT_FOUND",
    },
  });
}

export async function applyTemplateToCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { companyId } = companyDiagnosticAreasCompanyParamsSchema.parse(
    request.params,
  );
  const input = applyTemplateToCompanySchema.parse(request.body);
  const result = await applyTemplateToCompany(currentUser.id, companyId, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.areas,
    });
  }

  if (result.status === "company_not_found") {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  if (result.status === "template_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic template not found",
        code: "DIAGNOSTIC_TEMPLATE_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Company diagnostic setup already exists",
      code: "COMPANY_DIAGNOSTIC_SETUP_ALREADY_EXISTS",
    },
  });
}

export async function createCompanyDiagnosticAreaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { companyId } = companyDiagnosticAreasCompanyParamsSchema.parse(
    request.params,
  );
  const input = createCompanyDiagnosticAreaSchema.parse(request.body);
  const result = await createCompanyDiagnosticArea(currentUser.id, companyId, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.area,
    });
  }

  if (result.status === "company_not_found") {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Company diagnostic area already exists",
      code: "COMPANY_DIAGNOSTIC_AREA_ALREADY_EXISTS",
    },
  });
}

export async function createCompanyDiagnosticQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyDiagnosticAreaParamsSchema.parse(request.params);
  const input = createCompanyDiagnosticQuestionSchema.parse(request.body);
  const result = await createCompanyDiagnosticQuestion(currentUser.id, id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.question,
    });
  }

  if (result.status === "area_not_found") {
    return reply.status(404).send({
      error: {
        message: "Company diagnostic area not found",
        code: "COMPANY_DIAGNOSTIC_AREA_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Company diagnostic question already exists",
      code: "COMPANY_DIAGNOSTIC_QUESTION_ALREADY_EXISTS",
    },
  });
}

export async function updateCompanyDiagnosticAreaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyDiagnosticAreaParamsSchema.parse(request.params);
  const input = updateCompanyDiagnosticAreaSchema.parse(request.body);
  const result = await updateCompanyDiagnosticArea(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.area,
    });
  }

  if (result.status === "area_not_found") {
    return reply.status(404).send({
      error: {
        message: "Company diagnostic area not found",
        code: "COMPANY_DIAGNOSTIC_AREA_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Company diagnostic area slug already exists",
      code: "COMPANY_DIAGNOSTIC_AREA_SLUG_ALREADY_EXISTS",
    },
  });
}

export async function deleteCompanyDiagnosticAreaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyDiagnosticAreaParamsSchema.parse(request.params);
  const result = await deleteCompanyDiagnosticArea(currentUser.id, id);

  if (result.status === "deleted") {
    return reply.status(204).send();
  }

  return reply.status(404).send({
    error: {
      message: "Company diagnostic area not found",
      code: "COMPANY_DIAGNOSTIC_AREA_NOT_FOUND",
    },
  });
}

export async function updateCompanyDiagnosticQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyDiagnosticAreaParamsSchema.parse(request.params);
  const input = updateCompanyDiagnosticQuestionSchema.parse(request.body);
  const result = await updateCompanyDiagnosticQuestion(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.question,
    });
  }

  return reply.status(404).send({
    error: {
      message: "Company diagnostic question not found",
      code: "COMPANY_DIAGNOSTIC_QUESTION_NOT_FOUND",
    },
  });
}

export async function deleteCompanyDiagnosticQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyDiagnosticAreaParamsSchema.parse(request.params);
  const result = await deleteCompanyDiagnosticQuestion(currentUser.id, id);

  if (result.status === "deleted") {
    return reply.status(204).send();
  }

  return reply.status(404).send({
    error: {
      message: "Company diagnostic question not found",
      code: "COMPANY_DIAGNOSTIC_QUESTION_NOT_FOUND",
    },
  });
}
