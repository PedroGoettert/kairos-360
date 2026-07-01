import { requireSession } from "@/features/auth/server/session";
import { OrganizationSettings } from "@/features/organization/components/organization-settings";
import { getCurrentOrganization, getOrganizationUsers } from "@/features/organization/services/organization-server-service";

export default async function SettingsPage() {
  await requireSession("/configuracoes");
  const organization = await getCurrentOrganization();
  const users = organization ? await getOrganizationUsers() : [];
  return <OrganizationSettings organization={organization} users={users} />;
}
