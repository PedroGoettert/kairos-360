import type { FastifyInstance } from "fastify";

import { authPlugin } from "./auth.js";
import { companyDiagnosticAreasRoutes } from "../modules/company-diagnostic-areas/company-diagnostic-areas.routes.js";
import { corsPlugin } from "./cors.js";
import { companiesRoutes } from "../modules/companies/companies.routes.js";
import { diagnosticTemplatesRoutes } from "../modules/diagnostic-templates/diagnostic-templates.routes.js";
import { diagnosticsRoutes } from "../modules/diagnostics/diagnostics.routes.js";
import { healthPlugin } from "./health.js";
import { usersRoutes } from "../modules/users/users.routes.js";

export async function registerPlugins(server: FastifyInstance): Promise<void> {
  await server.register(corsPlugin);
  await server.register(authPlugin);
  await server.register(companiesRoutes);
  await server.register(diagnosticTemplatesRoutes);
  await server.register(companyDiagnosticAreasRoutes);
  await server.register(diagnosticsRoutes);
  await server.register(usersRoutes);
  await server.register(healthPlugin);
}
