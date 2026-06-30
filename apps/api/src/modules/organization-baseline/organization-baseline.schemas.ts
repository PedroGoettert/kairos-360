import { z } from "zod";

const createOptionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

const updateOptionalTextSchema = z.union([z.string().trim().min(1), z.null()]).optional();

export const organizationBaselineAreaParamsSchema = z.object({
  id: z.uuid(),
});

export const organizationBaselineQuestionParamsSchema = z.object({
  id: z.uuid(),
});

export const applyTemplateToOrganizationSchema = z.object({
  templateId: z.uuid(),
});

export const createOrganizationBaselineAreaSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: createOptionalTextSchema,
  displayOrder: z.int().positive().optional(),
});

export const createOrganizationBaselineQuestionSchema = z.object({
  question: z.string().trim().min(1),
  description: createOptionalTextSchema,
  displayOrder: z.int().positive().optional(),
});

export const updateOrganizationBaselineAreaSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    description: updateOptionalTextSchema,
    displayOrder: z.int().positive().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const updateOrganizationBaselineQuestionSchema = z
  .object({
    question: z.string().trim().min(1).optional(),
    description: updateOptionalTextSchema,
    displayOrder: z.int().positive().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const organizationBaselineQuestionSchema = z.object({
  id: z.uuid(),
  organizationAreaId: z.uuid(),
  question: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
});

export const organizationBaselineAreaSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  templateAreaId: z.uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
  questions: z.array(organizationBaselineQuestionSchema),
});

export const organizationBaselineAreasListSchema = z.array(
  organizationBaselineAreaSchema,
);
