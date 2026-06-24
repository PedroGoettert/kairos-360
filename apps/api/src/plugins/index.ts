import type { FastifyInstance } from "fastify";

import { authPlugin } from "./auth.js";
import { corsPlugin } from "./cors.js";
import { healthPlugin } from "./health.js";
import { companiesRoutes } from "../modules/companies/companies.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";

export async function registerPlugins(server: FastifyInstance): Promise<void> {
  await server.register(corsPlugin);
  await server.register(authPlugin);
  await server.register(companiesRoutes);
  await server.register(usersRoutes);
  await server.register(healthPlugin);
}
