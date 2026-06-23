import type { FastifyInstance } from "fastify";

import { healthPlugin } from "./health.js";

export async function registerPlugins(server: FastifyInstance): Promise<void> {
  await server.register(healthPlugin);
}
