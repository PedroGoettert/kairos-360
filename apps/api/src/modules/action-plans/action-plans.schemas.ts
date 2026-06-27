import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const actionPlanStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "completed",
]);

export const actionPlanParamsSchema = z.object({
  id: z.uuid(),
});

export const companyActionPlansParamsSchema = z.object({
  companyId: z.uuid(),
});

export const createActionPlanSchema = z.object({
  companyId: z.uuid(),
  diagnosticId: z.uuid().optional().nullable().transform((value) => value ?? null),
  areaId: z.uuid().optional().nullable().transform((value) => value ?? null),
  title: z.string().trim().min(1),
  description: optionalTextSchema,
  responsible: optionalTextSchema,
  dueDate: z.coerce.date().optional().nullable().transform((value) => value ?? null),
  status: actionPlanStatusSchema.optional(),
});

export const updateActionPlanSchema = z
  .object({
    diagnosticId: z.uuid().optional().nullable(),
    areaId: z.uuid().optional().nullable(),
    title: z.string().trim().min(1).optional(),
    description: z.union([z.string().trim().min(1), z.null()]).optional(),
    responsible: z.union([z.string().trim().min(1), z.null()]).optional(),
    dueDate: z.coerce.date().optional().nullable(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const updateActionPlanStatusSchema = z.object({
  status: actionPlanStatusSchema,
});

export const actionPlanSchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  createdByUserId: z.string(),
  diagnosticId: z.uuid().nullable(),
  areaId: z.uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  responsible: z.string().nullable(),
  dueDate: z.date().nullable(),
  status: actionPlanStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const actionPlansListSchema = z.array(actionPlanSchema);
