import type { FastifyInstance } from "fastify";

import { actionPlansRoutes } from "../modules/action-plans/action-plans.routes.js";
import { authPlugin } from "./auth.js";
import { companyDiagnosticAreasRoutes } from "../modules/company-diagnostic-areas/company-diagnostic-areas.routes.js";
import { corsPlugin } from "./cors.js";
import { companiesRoutes } from "../modules/companies/companies.routes.js";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes.js";
import { diagnosticTemplatesRoutes } from "../modules/diagnostic-templates/diagnostic-templates.routes.js";
import { diagnosticsRoutes } from "../modules/diagnostics/diagnostics.routes.js";
import { healthPlugin } from "./health.js";
import { organizationsRoutes } from "../modules/organizations/organizations.routes.js";
import { reportsRoutes } from "../modules/reports/reports.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";

export async function registerPlugins(server: FastifyInstance): Promise<void> {
  await corsPlugin(server, {});
  await server.register(authPlugin);
  await server.register(actionPlansRoutes);
  await server.register(companiesRoutes);
  await server.register(dashboardRoutes);
  await server.register(diagnosticTemplatesRoutes);
  await server.register(companyDiagnosticAreasRoutes);
  await server.register(diagnosticsRoutes);
  await server.register(organizationsRoutes);
  await server.register(reportsRoutes);
  await server.register(usersRoutes);
  await server.register(healthPlugin);
}
