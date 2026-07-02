import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import { companyDashboardParamsSchema } from "./dashboard.schemas.js";
import {
  getCompanyDashboard,
  getOrganizationDashboard,
} from "./dashboard.service.js";

export async function getCompanyDashboardController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { companyId } = companyDashboardParamsSchema.parse(request.params);
  const result = await getCompanyDashboard(currentUser.id, companyId);

  if (result.status === "found") {
    return reply.send({
      data: result.dashboard,
    });
  }

  return reply.status(404).send({
    error: {
      message: "Company not found",
      code: "COMPANY_NOT_FOUND",
    },
  });
}

export async function getOrganizationDashboardController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const result = await getOrganizationDashboard(currentUser.id);

  if (result.status === "found") {
    return reply.send({
      data: result.dashboard,
    });
  }

  return reply.status(404).send({
    error: {
      message: "Organization not found",
      code: "ORGANIZATION_NOT_FOUND",
    },
  });
}
