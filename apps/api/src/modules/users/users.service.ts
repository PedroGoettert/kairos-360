import type { FastifyRequest } from "fastify";

import { getAuthSession } from "../../auth/session.js";
import { currentUserSchema } from "./users.schemas.js";
import type { CurrentUser } from "./users.types.js";

export async function getCurrentUser(
  request: FastifyRequest,
): Promise<CurrentUser | null> {
  const session = await getAuthSession(request);

  if (!session) {
    return null;
  }

  return currentUserSchema.parse(session.user);
}
