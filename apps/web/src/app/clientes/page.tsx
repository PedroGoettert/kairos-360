import { requireSession } from "@/features/auth/server/session";
import { ClientsPage } from "@/features/companies/components/clients-page";

export default async function ClientesPage() {
  await requireSession("/clientes");

  return <ClientsPage />;
}
