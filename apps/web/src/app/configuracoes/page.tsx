import { requireSession } from "@/features/auth/server/session";
import { OrganizationSettings } from "@/features/organization/components/organization-settings";

export default async function SettingsPage() { await requireSession("/configuracoes"); return <OrganizationSettings />; }
