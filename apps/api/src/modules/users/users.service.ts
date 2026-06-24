import type { FastifyRequest } from "fastify";
import { eq } from "drizzle-orm";

import { getAuthSession } from "../../auth/session.js";
import { db } from "../../database/index.js";
import { user } from "../../database/schema/index.js";
import { currentUserSchema } from "./users.schemas.js";
import type { CurrentUser } from "./users.types.js";

export async function getCurrentUser(
  request: FastifyRequest,
): Promise<CurrentUser | null> {
  const session = await getAuthSession(request);

  if (!session) {
    return null;
  }

  const [currentUser] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!currentUser) {
    return null;
  }

  return currentUserSchema.parse(currentUser);
}
