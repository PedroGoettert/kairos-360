import type { z } from "zod";

import type {
  companyDashboardParamsSchema,
  companyDashboardSchema,
} from "./dashboard.schemas.js";

export type CompanyDashboardParams = z.infer<
  typeof companyDashboardParamsSchema
>;
export type CompanyDashboard = z.infer<typeof companyDashboardSchema>;

export type GetCompanyDashboardResult =
  | {
      status: "found";
      dashboard: CompanyDashboard;
    }
  | {
      status: "company_not_found";
    };
