import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "consultant", "viewer"]);

export const currentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  role: userRoleSchema,
});
