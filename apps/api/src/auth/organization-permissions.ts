import type { OrganizationUserRole } from "../modules/organizations/organizations.types.js";

export function canViewOrganization(_role: OrganizationUserRole): boolean {
  return true;
}

export function canManageOrganization(role: OrganizationUserRole): boolean {
  return role === "owner" || role === "admin";
}

export function canManageMembers(role: OrganizationUserRole): boolean {
  return role === "owner" || role === "admin";
}

export function canManageBaseline(role: OrganizationUserRole): boolean {
  return role === "owner" || role === "admin" || role === "manager";
}

export function canManageManualMetrics(role: OrganizationUserRole): boolean {
  return role === "owner" || role === "admin" || role === "manager";
}

export function canManageActionPlans(role: OrganizationUserRole): boolean {
  return role === "owner" || role === "admin" || role === "manager";
}
