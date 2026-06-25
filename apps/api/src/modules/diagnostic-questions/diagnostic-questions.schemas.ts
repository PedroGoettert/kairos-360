import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const diagnosticAreaParamsSchema = z.object({
  areaId: z.uuid(),
});

export const diagnosticQuestionParamsSchema = z.object({
  id: z.uuid(),
});

export const createDiagnosticQuestionSchema = z.object({
  question: z.string().trim().min(1),
  description: optionalTextSchema,
  displayOrder: z.int().positive().optional(),
});

export const updateDiagnosticQuestionSchema = z
  .object({
    question: z.string().trim().min(1).optional(),
    description: optionalTextSchema,
    displayOrder: z.int().positive().optional(),
  })
  .refine(
    (input) =>
      input.question !== undefined ||
      input.description !== undefined ||
      input.displayOrder !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const updateDiagnosticQuestionStatusSchema = z.object({
  isActive: z.boolean(),
});

export const diagnosticQuestionSchema = z.object({
  id: z.uuid(),
  areaId: z.uuid(),
  question: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  isActive: z.boolean().optional(),
});

export const diagnosticAreaWithQuestionsSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
  questions: z.array(diagnosticQuestionSchema),
});

export const diagnosticAreasWithQuestionsSchema = z.array(
  diagnosticAreaWithQuestionsSchema,
);
