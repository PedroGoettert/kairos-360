import type { z } from "zod";

import type {
  applyTemplateToCompanySchema,
  companyDiagnosticAreaParamsSchema,
  companyDiagnosticAreaSchema,
  companyDiagnosticAreasCompanyParamsSchema,
  companyDiagnosticAreasListSchema,
  companyDiagnosticQuestionSchema,
  createCompanyDiagnosticAreaSchema,
  createCompanyDiagnosticQuestionSchema,
} from "./company-diagnostic-areas.schemas.js";

export type CompanyDiagnosticAreasCompanyParams = z.infer<
  typeof companyDiagnosticAreasCompanyParamsSchema
>;
export type CompanyDiagnosticAreaParams = z.infer<
  typeof companyDiagnosticAreaParamsSchema
>;
export type ApplyTemplateToCompanyInput = z.infer<
  typeof applyTemplateToCompanySchema
>;
export type CreateCompanyDiagnosticAreaInput = z.infer<
  typeof createCompanyDiagnosticAreaSchema
>;
export type CreateCompanyDiagnosticQuestionInput = z.infer<
  typeof createCompanyDiagnosticQuestionSchema
>;
export type CompanyDiagnosticQuestion = z.infer<
  typeof companyDiagnosticQuestionSchema
>;
export type CompanyDiagnosticArea = z.infer<typeof companyDiagnosticAreaSchema>;
export type CompanyDiagnosticAreasList = z.infer<
  typeof companyDiagnosticAreasListSchema
>;

export type ListCompanyDiagnosticAreasResult =
  | {
      status: "found";
      areas: CompanyDiagnosticAreasList;
    }
  | {
      status: "company_not_found";
    };

export type GetCompanyDiagnosticAreaByIdResult =
  | {
      status: "found";
      area: CompanyDiagnosticArea;
    }
  | {
      status: "area_not_found";
    };

export type ApplyTemplateToCompanyResult =
  | {
      status: "created";
      areas: CompanyDiagnosticAreasList;
    }
  | {
      status:
        | "company_not_found"
        | "template_not_found"
        | "setup_already_exists";
    };

export type CreateCompanyDiagnosticAreaResult =
  | {
      status: "created";
      area: CompanyDiagnosticArea;
    }
  | {
      status: "company_not_found" | "area_already_exists";
    };

export type CreateCompanyDiagnosticQuestionResult =
  | {
      status: "created";
      question: CompanyDiagnosticQuestion;
    }
  | {
      status: "area_not_found" | "question_already_exists";
    };
