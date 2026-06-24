import type { FastifyReply, FastifyRequest } from "fastify";

import { getCurrentUser } from "../users/users.service.js";
import type { CurrentUser } from "../users/users.types.js";
import {
  companyParamsSchema,
  createCompanySchema,
} from "./companies.schemas.js";
import {
  createCompany,
  getCompanyById,
  listCompanies,
} from "./companies.service.js";

async function requireCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<CurrentUser | null> {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    void reply.status(401).send({
      error: {
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      },
    });

    return null;
  }

  return currentUser;
}

function requireAdmin(currentUser: CurrentUser, reply: FastifyReply): boolean {
  if (currentUser.role === "admin") {
    return true;
  }

  void reply.status(403).send({
    error: {
      message: "Forbidden",
      code: "FORBIDDEN",
    },
  });

  return false;
}

export async function createCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = await requireCurrentUser(request, reply);

  if (!currentUser) {
    return;
  }

  if (!requireAdmin(currentUser, reply)) {
    return;
  }

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
  const currentUser = await requireCurrentUser(request, reply);

  if (!currentUser) {
    return;
  }

  const companies = await listCompanies(currentUser.id);

  return reply.send({
    data: companies,
  });
}

export async function getCompanyByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = await requireCurrentUser(request, reply);

  if (!currentUser) {
    return;
  }

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
