import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  companyParamsSchema,
  createCompanySchema,
  updateCompanySchema,
} from "./companies.schemas.js";
import {
  createCompany,
  deleteCompany,
  getCompanyById,
  listCompanies,
  updateCompany,
} from "./companies.service.js";

export async function createCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createCompanySchema.parse(request.body);
  const company = await createCompany(currentUser.id, input);

  return reply.status(201).send({
    data: company,
  });
}

export async function listCompaniesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const companies = await listCompanies(currentUser.id);

  return reply.send({
    data: companies,
  });
}

export async function getCompanyByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyParamsSchema.parse(request.params);
  const company = await getCompanyById(currentUser.id, id);

  if (!company) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: company,
  });
}

export async function updateCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyParamsSchema.parse(request.params);
  const input = updateCompanySchema.parse(request.body);
  const company = await updateCompany(currentUser.id, id, input);

  if (!company) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: company,
  });
}

export async function deleteCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = companyParamsSchema.parse(request.params);
  const company = await deleteCompany(currentUser.id, id);

  if (!company) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: company,
  });
}
