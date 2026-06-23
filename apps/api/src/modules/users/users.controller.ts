import type { FastifyReply, FastifyRequest } from "fastify";

import { getCurrentUser } from "./users.service.js";

export async function getCurrentUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return reply.status(401).send({
      error: {
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      },
    });
  }

  return reply.send({
    data: currentUser,
  });
}
