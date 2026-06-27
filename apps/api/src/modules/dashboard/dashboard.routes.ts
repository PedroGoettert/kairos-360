import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import { getCompanyDashboardController } from "./dashboard.controller.js";

export async function dashboardRoutes(server: FastifyInstance): Promise<void> {
  server.get(
    "/companies/:companyId/dashboard",
    {
      preHandler: requireAuth,
    },
    getCompanyDashboardController,
  );
}
