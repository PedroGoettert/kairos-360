import { getFromApi, ServerApiError } from "@/lib/server-api";
import type { Organization, OrganizationUser } from "@/features/organization/types/organization-types";

export async function getCurrentOrganization(): Promise<Organization | null> {
  try { return await getFromApi<Organization>("/organization"); } catch (error) { if (error instanceof ServerApiError && error.status === 404) return null; throw error; }
}

export async function getOrganizationUsers(): Promise<OrganizationUser[]> {
  return getFromApi<OrganizationUser[]>("/organization/users");
}
