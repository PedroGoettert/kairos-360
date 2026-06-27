import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";
import {
  actionPlanParamsSchema,
  companyActionPlansParamsSchema,
  createActionPlanSchema,
  updateActionPlanSchema,
  updateActionPlanStatusSchema,
} from "./action-plans.schemas.js";
import {
  createActionPlan,
  listActionPlansByCompany,
  updateActionPlan,
  updateActionPlanStatus,
} from "./action-plans.service.js";

export async function createActionPlanController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const input = createActionPlanSchema.parse(request.body);
  const result = await createActionPlan(currentUser.id, input);

  if (result.status === "created") {
    return reply.status(201).send({
      data: result.actionPlan,
    });
  }

  const errorMap = {
    company_not_found: {
      status: 404,
      message: "Company not found",
      code: "COMPANY_NOT_FOUND",
    },
    diagnostic_not_found: {
      status: 404,
      message: "Diagnostic not found for company",
      code: "DIAGNOSTIC_NOT_FOUND",
    },
    area_not_found: {
      status: 404,
      message: "Company diagnostic area not found for company",
      code: "COMPANY_DIAGNOSTIC_AREA_NOT_FOUND",
    },
  } as const;

  const error = errorMap[result.status];

  return reply.status(error.status).send({
    error: {
      message: error.message,
      code: error.code,
    },
  });
}

export async function listActionPlansByCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { companyId } = companyActionPlansParamsSchema.parse(request.params);
  const actionPlans = await listActionPlansByCompany(currentUser.id, companyId);

  if (!actionPlans) {
    return reply.status(404).send({
      error: {
        message: "Company not found",
        code: "COMPANY_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: actionPlans,
  });
}

export async function updateActionPlanController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = actionPlanParamsSchema.parse(request.params);
  const input = updateActionPlanSchema.parse(request.body);
  const result = await updateActionPlan(currentUser.id, id, input);

  if (result.status === "updated") {
    return reply.send({
      data: result.actionPlan,
    });
  }

  const errorMap = {
    action_plan_not_found: {
      status: 404,
      message: "Action plan not found",
      code: "ACTION_PLAN_NOT_FOUND",
    },
    diagnostic_not_found: {
      status: 404,
      message: "Diagnostic not found for company",
      code: "DIAGNOSTIC_NOT_FOUND",
    },
    area_not_found: {
      status: 404,
      message: "Company diagnostic area not found for company",
      code: "COMPANY_DIAGNOSTIC_AREA_NOT_FOUND",
    },
  } as const;

  const error = errorMap[result.status];

  return reply.status(error.status).send({
    error: {
      message: error.message,
      code: error.code,
    },
  });
}

export async function updateActionPlanStatusController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = getRequiredCurrentUser(request);
  const { id } = actionPlanParamsSchema.parse(request.params);
  const input = updateActionPlanStatusSchema.parse(request.body);
  const actionPlan = await updateActionPlanStatus(currentUser.id, id, input);

  if (!actionPlan) {
    return reply.status(404).send({
      error: {
        message: "Action plan not found",
        code: "ACTION_PLAN_NOT_FOUND",
      },
    });
  }

  return reply.send({
    data: actionPlan,
  });
}
