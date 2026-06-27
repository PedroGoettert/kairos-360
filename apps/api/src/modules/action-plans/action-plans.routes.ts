import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  createActionPlanController,
  listActionPlansByCompanyController,
  updateActionPlanController,
  updateActionPlanStatusController,
} from "./action-plans.controller.js";

export async function actionPlansRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.post(
    "/action-plans",
    {
      preHandler: requireAuth,
    },
    createActionPlanController,
  );
  server.get(
    "/companies/:companyId/action-plans",
    {
      preHandler: requireAuth,
    },
    listActionPlansByCompanyController,
  );
  server.patch(
    "/action-plans/:id",
    {
      preHandler: requireAuth,
    },
    updateActionPlanController,
  );
  server.patch(
    "/action-plans/:id/status",
    {
      preHandler: requireAuth,
    },
    updateActionPlanStatusController,
  );
}
