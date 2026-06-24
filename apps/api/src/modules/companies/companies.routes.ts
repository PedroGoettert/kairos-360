import type { FastifyInstance } from "fastify";

import {
  createCompanyController,
  getCompanyByIdController,
  listCompaniesController,
} from "./companies.controller.js";

export async function companiesRoutes(server: FastifyInstance): Promise<void> {
  server.post("/companies", createCompanyController);
  server.get("/companies", listCompaniesController);
  server.get("/companies/:id", getCompanyByIdController);
}
