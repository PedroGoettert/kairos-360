import { z } from "zod";

export const diagnosticQuestionSchema = z.object({
  id: z.uuid(),
  areaId: z.uuid(),
  question: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number().int(),
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
