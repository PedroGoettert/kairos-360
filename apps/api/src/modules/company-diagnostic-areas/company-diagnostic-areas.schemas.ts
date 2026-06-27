import { z } from "zod";

const createOptionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

const updateOptionalTextSchema = z
  .union([
    z.string().trim().min(1),
    z.null(),
  ])
  .optional();

export const companyDiagnosticAreasCompanyParamsSchema = z.object({
  companyId: z.uuid(),
});

export const companyDiagnosticAreaParamsSchema = z.object({
  id: z.uuid(),
});

export const companyDiagnosticQuestionParamsSchema = z.object({
  id: z.uuid(),
});

export const applyTemplateToCompanySchema = z.object({
  templateId: z.uuid(),
});

export const createCompanyDiagnosticAreaSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: createOptionalTextSchema,
  displayOrder: z.int().positive().optional(),
});

export const createCompanyDiagnosticQuestionSchema = z.object({
  question: z.string().trim().min(1),
  description: createOptionalTextSchema,
  displayOrder: z.int().positive().optional(),
});

export const updateCompanyDiagnosticAreaSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    description: updateOptionalTextSchema,
    displayOrder: z.int().positive().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    {
      message: "At least one field must be provided",
    },
  );

export const updateCompanyDiagnosticQuestionSchema = z
  .object({
    question: z.string().trim().min(1).optional(),
    description: updateOptionalTextSchema,
    displayOrder: z.int().positive().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    {
      message: "At least one field must be provided",
    },
  );

export const companyDiagnosticQuestionSchema = z.object({
  id: z.uuid(),
  companyAreaId: z.uuid(),
  question: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
});

export const companyDiagnosticAreaSchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  templateAreaId: z.uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
  questions: z.array(companyDiagnosticQuestionSchema),
});

export const companyDiagnosticAreasListSchema = z.array(
  companyDiagnosticAreaSchema,
);
