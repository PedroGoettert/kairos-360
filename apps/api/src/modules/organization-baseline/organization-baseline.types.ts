import type { z } from "zod";

import type {
  applyTemplateToOrganizationSchema,
  createOrganizationBaselineAreaSchema,
  createOrganizationBaselineQuestionSchema,
  organizationBaselineAreaParamsSchema,
  organizationBaselineAreaSchema,
  organizationBaselineAreasListSchema,
  organizationBaselineQuestionParamsSchema,
  organizationBaselineQuestionSchema,
  updateOrganizationBaselineAreaSchema,
  updateOrganizationBaselineQuestionSchema,
} from "./organization-baseline.schemas.js";

export type OrganizationBaselineAreaParams = z.infer<
  typeof organizationBaselineAreaParamsSchema
>;
export type OrganizationBaselineQuestionParams = z.infer<
  typeof organizationBaselineQuestionParamsSchema
>;
export type ApplyTemplateToOrganizationInput = z.infer<
  typeof applyTemplateToOrganizationSchema
>;
export type CreateOrganizationBaselineAreaInput = z.infer<
  typeof createOrganizationBaselineAreaSchema
>;
export type CreateOrganizationBaselineQuestionInput = z.infer<
  typeof createOrganizationBaselineQuestionSchema
>;
export type UpdateOrganizationBaselineAreaInput = z.infer<
  typeof updateOrganizationBaselineAreaSchema
>;
export type UpdateOrganizationBaselineQuestionInput = z.infer<
  typeof updateOrganizationBaselineQuestionSchema
>;
export type OrganizationBaselineQuestion = z.infer<
  typeof organizationBaselineQuestionSchema
>;
export type OrganizationBaselineArea = z.infer<
  typeof organizationBaselineAreaSchema
>;
export type OrganizationBaselineAreasList = z.infer<
  typeof organizationBaselineAreasListSchema
>;

export type OrganizationBaselineAccessResult =
  | { status: "found"; areas: OrganizationBaselineAreasList }
  | { status: "organization_not_found" };

export type GetOrganizationBaselineAreaByIdResult =
  | { status: "found"; area: OrganizationBaselineArea }
  | { status: "area_not_found" };

export type ApplyTemplateToOrganizationResult =
  | { status: "created"; areas: OrganizationBaselineAreasList }
  | {
      status:
        | "organization_not_found"
        | "forbidden"
        | "template_not_found"
        | "setup_already_exists";
    };

export type CreateOrganizationBaselineAreaResult =
  | { status: "created"; area: OrganizationBaselineArea }
  | { status: "organization_not_found" | "forbidden" | "area_already_exists" };

export type CreateOrganizationBaselineQuestionResult =
  | { status: "created"; question: OrganizationBaselineQuestion }
  | { status: "forbidden" | "area_not_found" | "question_already_exists" };

export type UpdateOrganizationBaselineAreaResult =
  | { status: "updated"; area: OrganizationBaselineArea }
  | { status: "forbidden" | "area_not_found" | "slug_already_exists" };

export type DeleteOrganizationBaselineAreaResult =
  | { status: "deactivated" }
  | { status: "forbidden" | "area_not_found" };

export type UpdateOrganizationBaselineQuestionResult =
  | { status: "updated"; question: OrganizationBaselineQuestion }
  | { status: "forbidden" | "question_not_found" };

export type DeleteOrganizationBaselineQuestionResult =
  | { status: "deleted" | "deactivated" }
  | { status: "forbidden" | "question_not_found" };
