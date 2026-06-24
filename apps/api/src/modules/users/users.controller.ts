import type { FastifyReply, FastifyRequest } from "fastify";

import { getRequiredCurrentUser } from "../../auth/guards.js";

export async function getCurrentUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return reply.send({
    data: getRequiredCurrentUser(request),
  });
}
