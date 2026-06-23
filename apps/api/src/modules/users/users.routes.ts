import type { FastifyInstance } from "fastify";

import { getCurrentUserController } from "./users.controller.js";

export async function usersRoutes(server: FastifyInstance): Promise<void> {
  server.get("/users/me", getCurrentUserController);
}
