import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  getCompanyDashboardController,
  getOrganizationDashboardController,
} from "./dashboard.controller.js";

export async function dashboardRoutes(server: FastifyInstance): Promise<void> {
  server.get(
    "/organization/dashboard",
    {
      preHandler: requireAuth,
    },
    getOrganizationDashboardController,
  );
  server.get(
    "/companies/:companyId/dashboard",
    {
      preHandler: requireAuth,
    },
    getCompanyDashboardController,
  );
}
