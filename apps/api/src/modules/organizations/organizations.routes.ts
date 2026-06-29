import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  createOrganizationController,
  createOrganizationUserController,
  getCurrentOrganizationController,
  listCurrentOrganizationUsersController,
  updateCurrentOrganizationController,
  updateOrganizationUserRoleController,
} from "./organizations.controller.js";

export async function organizationsRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.post(
    "/organizations",
    {
      preHandler: requireAuth,
    },
    createOrganizationController,
  );
  server.get(
    "/organization",
    {
      preHandler: requireAuth,
    },
    getCurrentOrganizationController,
  );
  server.patch(
    "/organization",
    {
      preHandler: requireAuth,
    },
    updateCurrentOrganizationController,
  );
  server.get(
    "/organization/users",
    {
      preHandler: requireAuth,
    },
    listCurrentOrganizationUsersController,
  );
  server.post(
    "/organization/users",
    {
      preHandler: requireAuth,
    },
    createOrganizationUserController,
  );
  server.patch(
    "/organization/users/:id/role",
    {
      preHandler: requireAuth,
    },
    updateOrganizationUserRoleController,
  );
}
