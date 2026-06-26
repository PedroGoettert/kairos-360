import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalUrlSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.url().nullable());

export const createCompanyFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da empresa."),
  tradeName: optionalTextSchema,
  document: optionalTextSchema,
  industry: optionalTextSchema,
  website: optionalUrlSchema,
  notes: optionalTextSchema,
});
