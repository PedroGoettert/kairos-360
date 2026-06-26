import type { z } from "zod";
import type { createCompanyFormSchema } from "@/features/companies/schemas/company-schema";

export type CreateCompanyInput = z.infer<typeof createCompanyFormSchema>;
export type CreateCompanyFormValues = z.input<typeof createCompanyFormSchema>;

export type Company = {
  id: string;
  ownerUserId: string;
  name: string;
  tradeName: string | null;
  document: string | null;
  industry: string | null;
  website: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error: {
    message: string;
    code: string;
  };
};
