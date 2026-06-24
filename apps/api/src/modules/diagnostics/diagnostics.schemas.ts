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
