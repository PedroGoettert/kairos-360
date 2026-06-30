import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const baselineDiagnosticStatusSchema = z.enum(["draft", "completed"]);

export const baselineDiagnosticParamsSchema = z.object({
  id: z.uuid(),
});

export const baselineDiagnosticAnswerParamsSchema = z.object({
  id: z.uuid(),
});

export const createBaselineDiagnosticSchema = z.object({
  title: optionalTextSchema,
  notes: optionalTextSchema,
});

export const createBaselineDiagnosticAnswerSchema = z.object({
  questionId: z.uuid(),
  score: z.int().min(0).max(10),
  comment: optionalTextSchema,
});

export const updateBaselineDiagnosticAnswerSchema = z
  .object({
    score: z.int().min(0).max(10).optional(),
    comment: optionalTextSchema,
  })
  .refine((input) => input.score !== undefined || input.comment !== undefined, {
    message: "At least one field must be provided",
  });

export const baselineDiagnosticSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  createdByUserId: z.string(),
  title: z.string().nullable(),
  notes: z.string().nullable(),
  status: baselineDiagnosticStatusSchema,
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const baselineDiagnosticsListSchema = z.array(
  baselineDiagnosticSchema,
);

export const baselineDiagnosticAnswerSchema = z.object({
  id: z.uuid(),
  diagnosticId: z.uuid(),
  questionId: z.uuid(),
  score: z.number().int().min(0).max(10),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const baselineDiagnosticAnswerWithQuestionSchema =
  baselineDiagnosticAnswerSchema.extend({
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

export const baselineDiagnosticAnswersListSchema = z.array(
  baselineDiagnosticAnswerWithQuestionSchema,
);

export const baselineDiagnosticHealthClassificationSchema = z.enum([
  "critical",
  "attention",
  "healthy",
]);

export const baselineDiagnosticAreaScoreSchema = z.object({
  areaId: z.uuid(),
  areaName: z.string(),
  areaSlug: z.string(),
  score: z.number(),
});

export const baselineDiagnosticScoresSummarySchema = z.object({
  diagnosticId: z.uuid(),
  generalScore: z.number(),
  healthClassification: baselineDiagnosticHealthClassificationSchema,
  mainBottleneck: baselineDiagnosticAreaScoreSchema,
  secondPriority: baselineDiagnosticAreaScoreSchema.nullable(),
  scores: z.array(baselineDiagnosticAreaScoreSchema),
});
