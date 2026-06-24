import type { z } from "zod";

import type {
  companiesListSchema,
  companyParamsSchema,
  companySchema,
  createCompanySchema,
} from "./companies.schemas.js";

export type CompanyParams = z.infer<typeof companyParamsSchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type Company = z.infer<typeof companySchema>;
export type CompaniesList = z.infer<typeof companiesListSchema>;
