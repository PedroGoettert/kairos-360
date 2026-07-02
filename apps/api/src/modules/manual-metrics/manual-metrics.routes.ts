import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../auth/guards.js";
import {
  createManualMetricController,
  deleteManualMetricController,
  getManualMetricByIdController,
  listManualMetricsController,
  updateManualMetricController,
} from "./manual-metrics.controller.js";

export async function manualMetricsRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.post(
    "/organization/manual-metrics",
    { preHandler: requireAuth },
    createManualMetricController,
  );
  server.get(
    "/organization/manual-metrics",
    { preHandler: requireAuth },
    listManualMetricsController,
  );
  server.get(
    "/organization/manual-metrics/:id",
    { preHandler: requireAuth },
    getManualMetricByIdController,
  );
  server.patch(
    "/organization/manual-metrics/:id",
    { preHandler: requireAuth },
    updateManualMetricController,
  );
  server.delete(
    "/organization/manual-metrics/:id",
    { preHandler: requireAuth },
    deleteManualMetricController,
  );
}
