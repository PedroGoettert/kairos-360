import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const companyParamsSchema = z.object({
  id: z.uuid(),
});

export const createCompanySchema = z.object({
  name: z.string().trim().min(1),
  tradeName: optionalTextSchema,
  document: optionalTextSchema,
  industry: optionalTextSchema,
  website: z
    .url()
    .optional()
    .nullable()
    .transform((value) => value ?? null),
  notes: optionalTextSchema,
});

export const updateCompanySchema = createCompanySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one field must be provided",
  },
);

export const companySchema = z.object({
  id: z.uuid(),
  ownerUserId: z.string(),
  name: z.string(),
  tradeName: z.string().nullable(),
  document: z.string().nullable(),
  industry: z.string().nullable(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const companiesListSchema = z.array(companySchema);
