import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createDiagnosticTemplateAreaSchema,
  createDiagnosticTemplateQuestionSchema,
  createDiagnosticTemplateSchema,
  diagnosticTemplateAreaParamsSchema,
  diagnosticTemplateParamsSchema,
} from "./diagnostic-templates.schemas.js";
import {
  createDiagnosticTemplate,
  createDiagnosticTemplateArea,
  createDiagnosticTemplateQuestion,
  getDiagnosticTemplateById,
  listDiagnosticTemplates,
} from "./diagnostic-templates.service.js";

export async function listDiagnosticTemplatesController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const templates = await listDiagnosticTemplates();

  return reply.send({
    data: templates,
  });
}

export async function getDiagnosticTemplateByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = diagnosticTemplateParamsSchema.parse(request.params);
  const result = await getDiagnosticTemplateById(id);

  if (result.status === "found") {
    return reply.send({
      data: result.template,
    });
  }

  return reply.status(404).send({
    error: {
      message: "Diagnostic template not found",
      code: "DIAGNOSTIC_TEMPLATE_NOT_FOUND",
    },
  });
}

export async function createDiagnosticTemplateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = createDiagnosticTemplateSchema.parse(request.body);
  const result = await createDiagnosticTemplate(input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.template,
    });
  }

  return reply.status(409).send({
    error: {
      message: "Diagnostic template already exists",
      code: "DIAGNOSTIC_TEMPLATE_ALREADY_EXISTS",
    },
  });
}

export async function createDiagnosticTemplateAreaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = diagnosticTemplateParamsSchema.parse(request.params);
  const input = createDiagnosticTemplateAreaSchema.parse(request.body);
  const result = await createDiagnosticTemplateArea(id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.area,
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
      message: "Diagnostic template area already exists",
      code: "DIAGNOSTIC_TEMPLATE_AREA_ALREADY_EXISTS",
    },
  });
}

export async function createDiagnosticTemplateQuestionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = diagnosticTemplateAreaParamsSchema.parse(request.params);
  const input = createDiagnosticTemplateQuestionSchema.parse(request.body);
  const result = await createDiagnosticTemplateQuestion(id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.question,
    });
  }

  if (result.status === "template_area_not_found") {
    return reply.status(404).send({
      error: {
        message: "Diagnostic template area not found",
        code: "DIAGNOSTIC_TEMPLATE_AREA_NOT_FOUND",
      },
    });
  }

  return reply.status(409).send({
    error: {
      message: "Diagnostic template question already exists",
      code: "DIAGNOSTIC_TEMPLATE_QUESTION_ALREADY_EXISTS",
    },
  });
}
