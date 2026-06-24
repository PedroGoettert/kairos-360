import type { FastifyInstance } from "fastify";

import { requireAuth, requireRole } from "../../auth/guards.js";
import {
  createCompanyController,
  deleteCompanyController,
  getCompanyByIdController,
  listCompaniesController,
  updateCompanyController,
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
  server.patch(
    "/companies/:id",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    updateCompanyController,
  );
  server.delete(
    "/companies/:id",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    deleteCompanyController,
  );
}
