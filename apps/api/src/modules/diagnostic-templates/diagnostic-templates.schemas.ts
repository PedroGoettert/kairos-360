import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const diagnosticTemplateParamsSchema = z.object({
  id: z.uuid(),
});

export const diagnosticTemplateAreaParamsSchema = z.object({
  id: z.uuid(),
});

export const createDiagnosticTemplateSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: optionalTextSchema,
  isDefault: z.boolean().optional(),
});

export const createDiagnosticTemplateAreaSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: optionalTextSchema,
  displayOrder: z.int().positive().optional(),
});

export const createDiagnosticTemplateQuestionSchema = z.object({
  question: z.string().trim().min(1),
  description: optionalTextSchema,
  displayOrder: z.int().positive().optional(),
});

export const diagnosticTemplateQuestionSchema = z.object({
  id: z.uuid(),
  templateAreaId: z.uuid(),
  question: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
});

export const diagnosticTemplateAreaSchema = z.object({
  id: z.uuid(),
  templateId: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  questions: z.array(diagnosticTemplateQuestionSchema),
});

export const diagnosticTemplateSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  isDefault: z.boolean(),
  areas: z.array(diagnosticTemplateAreaSchema),
});

export const diagnosticTemplatesListSchema = z.array(diagnosticTemplateSchema);
