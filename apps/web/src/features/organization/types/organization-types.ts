export type OrganizationRole = "owner" | "admin" | "manager" | "viewer";

export type Organization = {
  id: string;
  createdByUserId: string;
  name: string;
  slug: string;
  tradeName: string | null;
  document: string | null;
  industry: string | null;
  website: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationUser = {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  status: "active" | "disabled";
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string; emailVerified: boolean; image: string | null };
};
