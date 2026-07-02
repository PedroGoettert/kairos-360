import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const manualMetricCategorySchema = z.enum([
  "marketing",
  "sales",
  "finance",
  "operations",
  "customer_service",
  "hr",
  "management",
]);

export const manualMetricParamsSchema = z.object({
  id: z.uuid(),
});

export const createManualMetricSchema = z.object({
  category: manualMetricCategorySchema,
  metricKey: z.string().trim().min(1),
  metricLabel: z.string().trim().min(1),
  value: z.number().finite(),
  unit: optionalTextSchema,
  referenceDate: z.coerce.date(),
  notes: optionalTextSchema,
});

export const updateManualMetricSchema = z
  .object({
    category: manualMetricCategorySchema.optional(),
    metricKey: z.string().trim().min(1).optional(),
    metricLabel: z.string().trim().min(1).optional(),
    value: z.number().finite().optional(),
    unit: z.union([z.string().trim().min(1), z.null()]).optional(),
    referenceDate: z.coerce.date().optional(),
    notes: z.union([z.string().trim().min(1), z.null()]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const manualMetricSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  createdByUserId: z.string(),
  category: manualMetricCategorySchema,
  metricKey: z.string(),
  metricLabel: z.string(),
  value: z.number(),
  unit: z.string().nullable(),
  referenceDate: z.date(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const manualMetricsListSchema = z.array(manualMetricSchema);
