import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import { getCurrentUserController } from "./users.controller.js";

export async function usersRoutes(server: FastifyInstance): Promise<void> {
  server.get(
    "/users/me",
    {
      preHandler: requireAuth,
    },
    getCurrentUserController,
  );
}
