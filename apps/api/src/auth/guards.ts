import type { FastifyReply, FastifyRequest } from "fastify";

import { getCurrentUser } from "../modules/users/users.service.js";
import type { CurrentUser, UserRole } from "../modules/users/users.types.js";

export function getRequiredCurrentUser(request: FastifyRequest): CurrentUser {
  if (!request.currentUser) {
    throw new Error("Current user is required");
  }

  return request.currentUser;
}

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    void reply.status(401).send({
      error: {
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      },
    });

    return;
  }

  request.currentUser = currentUser;
}

export function requireRole(allowedRole: UserRole) {
  return async function requireRoleHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const currentUser = request.currentUser ?? (await getCurrentUser(request));

    if (!currentUser) {
      void reply.status(401).send({
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      });

      return;
    }

    request.currentUser = currentUser;

    if (currentUser.role !== allowedRole) {
      void reply.status(403).send({
        error: {
          message: "Forbidden",
          code: "FORBIDDEN",
        },
      });

      return;
    }
  };
}
