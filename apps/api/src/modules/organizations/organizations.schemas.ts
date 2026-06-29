import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((value) => value ?? null);

export const organizationUserRoleSchema = z.enum([
  "owner",
  "admin",
  "manager",
  "viewer",
]);

export const organizationUserStatusSchema = z.enum(["active", "disabled"]);

export const organizationUserParamsSchema = z.object({
  id: z.uuid(),
});

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1).optional(),
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

export const updateOrganizationSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    tradeName: z.union([z.string().trim().min(1), z.null()]).optional(),
    document: z.union([z.string().trim().min(1), z.null()]).optional(),
    industry: z.union([z.string().trim().min(1), z.null()]).optional(),
    website: z.union([z.url(), z.null()]).optional(),
    notes: z.union([z.string().trim().min(1), z.null()]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const createOrganizationUserSchema = z.object({
  email: z.email(),
  role: organizationUserRoleSchema,
});

export const updateOrganizationUserRoleSchema = z.object({
  role: organizationUserRoleSchema,
});

export const organizationSchema = z.object({
  id: z.uuid(),
  createdByUserId: z.string(),
  name: z.string(),
  slug: z.string(),
  tradeName: z.string().nullable(),
  document: z.string().nullable(),
  industry: z.string().nullable(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const organizationUserSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  userId: z.string(),
  role: organizationUserRoleSchema,
  status: organizationUserStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
  }),
});

export const organizationUsersListSchema = z.array(organizationUserSchema);
