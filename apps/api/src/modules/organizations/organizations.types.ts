import type { z } from "zod";

import type {
  createOrganizationSchema,
  createOrganizationUserSchema,
  organizationSchema,
  organizationUserParamsSchema,
  organizationUserRoleSchema,
  organizationUserSchema,
  organizationUsersListSchema,
  updateOrganizationSchema,
  updateOrganizationUserRoleSchema,
} from "./organizations.schemas.js";

export type OrganizationUserRole = z.infer<typeof organizationUserRoleSchema>;
export type OrganizationUserParams = z.infer<
  typeof organizationUserParamsSchema
>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type CreateOrganizationUserInput = z.infer<
  typeof createOrganizationUserSchema
>;
export type UpdateOrganizationUserRoleInput = z.infer<
  typeof updateOrganizationUserRoleSchema
>;
export type Organization = z.infer<typeof organizationSchema>;
export type OrganizationUser = z.infer<typeof organizationUserSchema>;
export type OrganizationUsersList = z.infer<typeof organizationUsersListSchema>;
export type CurrentOrganizationMembership = {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationUserRole;
  status: "active" | "disabled";
  organization: Organization;
};

export type CreateOrganizationResult =
  | { status: "created"; organization: Organization }
  | { status: "user_already_has_organization" | "slug_already_exists" };

export type UpdateOrganizationResult =
  | { status: "updated"; organization: Organization }
  | { status: "organization_not_found" | "forbidden" | "slug_already_exists" };

export type CreateOrganizationUserResult =
  | { status: "created"; organizationUser: OrganizationUser }
  | {
      status:
        | "organization_not_found"
        | "forbidden"
        | "user_not_found"
        | "membership_already_exists";
    };

export type UpdateOrganizationUserRoleResult =
  | { status: "updated"; organizationUser: OrganizationUser }
  | {
      status:
        | "organization_not_found"
        | "forbidden"
        | "membership_not_found"
        | "last_owner";
    };
