import type { z } from "zod";

import type {
  createManualMetricSchema,
  manualMetricCategorySchema,
  manualMetricParamsSchema,
  manualMetricSchema,
  manualMetricsListSchema,
  updateManualMetricSchema,
} from "./manual-metrics.schemas.js";

export type ManualMetricCategory = z.infer<typeof manualMetricCategorySchema>;
export type ManualMetricParams = z.infer<typeof manualMetricParamsSchema>;
export type CreateManualMetricInput = z.infer<typeof createManualMetricSchema>;
export type UpdateManualMetricInput = z.infer<typeof updateManualMetricSchema>;
export type ManualMetric = z.infer<typeof manualMetricSchema>;
export type ManualMetricsList = z.infer<typeof manualMetricsListSchema>;

export type CreateManualMetricResult =
  | { status: "created"; manualMetric: ManualMetric }
  | { status: "organization_not_found" | "forbidden" };

export type GetManualMetricByIdResult =
  | { status: "found"; manualMetric: ManualMetric }
  | { status: "organization_not_found" | "manual_metric_not_found" };

export type ListManualMetricsResult =
  | { status: "found"; manualMetrics: ManualMetricsList }
  | { status: "organization_not_found" };

export type UpdateManualMetricResult =
  | { status: "updated"; manualMetric: ManualMetric }
  | {
      status:
        | "organization_not_found"
        | "forbidden"
        | "manual_metric_not_found";
    };

export type DeleteManualMetricResult =
  | { status: "deleted"; manualMetric: ManualMetric }
  | {
      status:
        | "organization_not_found"
        | "forbidden"
        | "manual_metric_not_found";
    };
