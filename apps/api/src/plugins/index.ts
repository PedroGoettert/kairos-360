import type { FastifyInstance } from "fastify";

import { authPlugin } from "./auth.js";
import { corsPlugin } from "./cors.js";
import { healthPlugin } from "./health.js";
import { companiesRoutes } from "../modules/companies/companies.routes.js";
import { diagnosticQuestionsRoutes } from "../modules/diagnostic-questions/diagnostic-questions.routes.js";
import { diagnosticsRoutes } from "../modules/diagnostics/diagnostics.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";

export async function registerPlugins(server: FastifyInstance): Promise<void> {
  await server.register(corsPlugin);
  await server.register(authPlugin);
  await server.register(companiesRoutes);
  await server.register(diagnosticQuestionsRoutes);
  await server.register(diagnosticsRoutes);
  await server.register(usersRoutes);
  await server.register(healthPlugin);
}
