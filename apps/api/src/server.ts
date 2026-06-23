import Fastify from "fastify";
import { ZodError } from "zod";

import { env } from "./env/index.js";
import { registerPlugins } from "./plugins/index.js";

const server = Fastify({
  logger: env.NODE_ENV === "test" ? false : true,
});

server.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        message: "Validation error",
        code: "VALIDATION_ERROR",
      },
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    error: {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    },
  });
});

server.setNotFoundHandler((_request, reply) => {
  return reply.status(404).send({
    error: {
      message: "Route not found",
      code: "ROUTE_NOT_FOUND",
    },
  });
});

async function start() {
  try {
    await registerPlugins(server);
    await server.listen({
      host: env.HOST,
      port: env.PORT,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

void start();
