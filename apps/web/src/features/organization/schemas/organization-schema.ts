import { z } from "zod";

const optionalText = z.string().trim().transform((value) => value || null);
export const organizationFormSchema = z.object({ name: z.string().trim().min(2, "Informe a razão social."), tradeName: optionalText, document: optionalText, industry: optionalText, website: z.union([z.literal(""), z.url("Informe uma URL válida.")]).transform((value) => value || null), notes: optionalText });
export const memberFormSchema = z.object({ email: z.email("Informe um e-mail válido."), role: z.enum(["admin", "manager", "viewer"]) });
export type OrganizationFormInput = z.input<typeof organizationFormSchema>;
export type OrganizationFormOutput = z.output<typeof organizationFormSchema>;
export type MemberFormInput = z.infer<typeof memberFormSchema>;
