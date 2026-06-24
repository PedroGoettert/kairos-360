import type { FastifyInstance } from "fastify";

import { requireAuth, requireRole } from "../../auth/guards.js";
import {
  createCompanyController,
  getCompanyByIdController,
  listCompaniesController,
} from "./companies.controller.js";

export async function companiesRoutes(server: FastifyInstance): Promise<void> {
  server.post(
    "/companies",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    createCompanyController,
  );
  server.get(
    "/companies",
    {
      preHandler: requireAuth,
    },
    listCompaniesController,
  );
  server.get(
    "/companies/:id",
    {
      preHandler: requireAuth,
    },
    getCompanyByIdController,
  );
}
