import { fromNodeHeaders } from "better-auth/node";
import type { FastifyRequest } from "fastify";

import { auth } from "./index.js";

export async function getAuthSession(request: FastifyRequest) {
  return auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });
}
