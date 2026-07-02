import type { z } from "zod";

import type {
  companyDashboardParamsSchema,
  companyDashboardSchema,
  organizationDashboardSchema,
} from "./dashboard.schemas.js";

export type CompanyDashboardParams = z.infer<
  typeof companyDashboardParamsSchema
>;
export type CompanyDashboard = z.infer<typeof companyDashboardSchema>;
export type OrganizationDashboard = z.infer<typeof organizationDashboardSchema>;

export type GetCompanyDashboardResult =
  | {
      status: "found";
      dashboard: CompanyDashboard;
    }
  | {
      status: "company_not_found";
    };

export type GetOrganizationDashboardResult =
  | {
      status: "found";
      dashboard: OrganizationDashboard;
    }
  | {
      status: "organization_not_found";
    };
