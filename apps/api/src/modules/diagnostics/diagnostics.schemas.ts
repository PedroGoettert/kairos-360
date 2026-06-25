import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const diagnosticStatusSchema = z.enum(["draft", "completed"]);

export const diagnosticParamsSchema = z.object({
  id: z.uuid(),
});

export const diagnosticAnswerParamsSchema = z.object({
  id: z.uuid(),
});

export const companyDiagnosticsParamsSchema = z.object({
  companyId: z.uuid(),
});

export const createDiagnosticSchema = z.object({
  companyId: z.uuid(),
  title: optionalTextSchema,
  notes: optionalTextSchema,
});

export const createDiagnosticAnswerSchema = z.object({
  questionId: z.uuid(),
  score: z.int().min(0).max(10),
  comment: optionalTextSchema,
});

export const updateDiagnosticAnswerSchema = z
  .object({
    score: z.int().min(0).max(10).optional(),
    comment: optionalTextSchema,
  })
  .refine((input) => input.score !== undefined || input.comment !== undefined, {
    message: "At least one field must be provided",
  });

export const diagnosticSchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  createdByUserId: z.string(),
  title: z.string().nullable(),
  notes: z.string().nullable(),
  status: diagnosticStatusSchema,
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const diagnosticsListSchema = z.array(diagnosticSchema);

export const diagnosticAnswerSchema = z.object({
  id: z.uuid(),
  diagnosticId: z.uuid(),
  questionId: z.uuid(),
  score: z.number().int().min(0).max(10),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const diagnosticAnswerWithQuestionSchema = diagnosticAnswerSchema.extend({
  question: z.object({
    id: z.uuid(),
    areaId: z.uuid(),
    question: z.string(),
    description: z.string().nullable(),
    displayOrder: z.number().int(),
    area: z.object({
      id: z.uuid(),
      name: z.string(),
      slug: z.string(),
      displayOrder: z.number().int(),
    }),
  }),
});

export const diagnosticAnswersListSchema = z.array(
  diagnosticAnswerWithQuestionSchema,
);
