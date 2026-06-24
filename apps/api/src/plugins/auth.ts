import type {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../auth/index.js";

async function dispatchAuthRequest(
  request: FastifyRequest,
  reply: FastifyReply,
  pathname?: string,
) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (pathname) {
    url.pathname = pathname;
  }

  const headers = fromNodeHeaders(request.headers);
  const authRequestInit: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.body) {
    authRequestInit.body = JSON.stringify(request.body);
  }

  const authRequest = new Request(url.toString(), authRequestInit);
  const response = await auth.handler(authRequest);

  reply.status(response.status);
  response.headers.forEach((value, key) => reply.header(key, value));

  return reply.send(response.body ? await response.text() : null);
}

export const authPlugin: FastifyPluginAsync = async (server) => {
  server.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      return dispatchAuthRequest(request, reply);
    },
  });

  server.post("/auth/sign-out", async (request, reply) => {
    return dispatchAuthRequest(request, reply, "/api/auth/sign-out");
  });
};
