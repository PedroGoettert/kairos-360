import { requireSession } from "@/features/auth/server/session";
import { MetricsOverview } from "@/features/dashboard/components/metrics-overview";
import { getOrganizationManualMetrics } from "@/features/manual-metrics/services/manual-metrics-server-service";
import { getCurrentOrganization } from "@/features/organization/services/organization-server-service";

export default async function MetricsPage() {
  await requireSession("/metricas");

  const organization = await getCurrentOrganization();

  if (!organization) {
    return (
      <MetricsOverview
        hasOrganization={false}
        initialMetrics={[]}
        loadError={null}
      />
    );
  }

  try {
    const manualMetrics = await getOrganizationManualMetrics();

    return (
      <MetricsOverview
        hasOrganization
        initialMetrics={manualMetrics}
        loadError={null}
      />
    );
  } catch (error) {
    return (
      <MetricsOverview
        hasOrganization
        initialMetrics={[]}
        loadError={
          error instanceof Error
            ? error.message
            : "Nao foi possivel consultar a API de metricas."
        }
      />
    );
  }
}
