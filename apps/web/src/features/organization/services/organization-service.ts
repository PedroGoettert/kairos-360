import { requestApi } from "@/lib/client-api";
import type { Organization, OrganizationRole, OrganizationUser } from "@/features/organization/types/organization-types";

export type OrganizationInput = { name: string; tradeName?: string | null; document?: string | null; industry?: string | null; website?: string | null; notes?: string | null };

export function createOrganization(input: OrganizationInput) { return requestApi<Organization>("/organizations", { method: "POST", body: JSON.stringify(input) }); }
export function updateOrganization(input: OrganizationInput) { return requestApi<Organization>("/organization", { method: "PATCH", body: JSON.stringify(input) }); }
export function addOrganizationUser(email: string, role: OrganizationRole) { return requestApi<OrganizationUser>("/organization/users", { method: "POST", body: JSON.stringify({ email, role }) }); }
export function changeOrganizationUserRole(id: string, role: OrganizationRole) { return requestApi<OrganizationUser>(`/organization/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }); }
