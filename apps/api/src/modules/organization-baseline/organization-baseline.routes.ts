import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  applyTemplateToOrganizationController,
  createOrganizationBaselineAreaController,
  createOrganizationBaselineQuestionController,
  deleteOrganizationBaselineAreaController,
  deleteOrganizationBaselineQuestionController,
  getOrganizationBaselineAreaByIdController,
  listOrganizationBaselineAreasController,
  updateOrganizationBaselineAreaController,
  updateOrganizationBaselineQuestionController,
} from "./organization-baseline.controller.js";

export async function organizationBaselineRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.post(
    "/organization/baseline-setup/from-template",
    { preHandler: requireAuth },
    applyTemplateToOrganizationController,
  );
  server.get(
    "/organization/baseline-areas",
    { preHandler: requireAuth },
    listOrganizationBaselineAreasController,
  );
  server.get(
    "/organization/baseline-areas/:id",
    { preHandler: requireAuth },
    getOrganizationBaselineAreaByIdController,
  );
  server.post(
    "/organization/baseline-areas",
    { preHandler: requireAuth },
    createOrganizationBaselineAreaController,
  );
  server.post(
    "/organization/baseline-areas/:id/questions",
    { preHandler: requireAuth },
    createOrganizationBaselineQuestionController,
  );
  server.patch(
    "/organization/baseline-areas/:id",
    { preHandler: requireAuth },
    updateOrganizationBaselineAreaController,
  );
  server.delete(
    "/organization/baseline-areas/:id",
    { preHandler: requireAuth },
    deleteOrganizationBaselineAreaController,
  );
  server.patch(
    "/organization/baseline-questions/:id",
    { preHandler: requireAuth },
    updateOrganizationBaselineQuestionController,
  );
  server.delete(
    "/organization/baseline-questions/:id",
    { preHandler: requireAuth },
    deleteOrganizationBaselineQuestionController,
  );
}
