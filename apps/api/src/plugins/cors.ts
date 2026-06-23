import fastifyCors from "@fastify/cors";
import type { FastifyPluginAsync } from "fastify";

import { env } from "../env/index.js";

export const corsPlugin: FastifyPluginAsync = async (server) => {
  await server.register(fastifyCors, {
    origin: env.WEB_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });
};
