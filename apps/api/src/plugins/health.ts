import type { FastifyPluginAsync } from "fastify";

export const healthPlugin: FastifyPluginAsync = async (server) => {
  server.get("/health", async () => {
    return {
      data: {
        status: "ok",
      },
    };
  });
};
