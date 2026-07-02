import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { ManualMetricsWorkflow } from "@/features/manual-metrics/components/manual-metrics-workflow";
import type { ManualMetric } from "@/features/manual-metrics/types/manual-metrics-types";

type MetricsOverviewProps = {
  hasOrganization: boolean;
  initialMetrics: ManualMetric[];
  loadError: string | null;
};

export function MetricsOverview({
  hasOrganization,
  initialMetrics,
  loadError,
}: MetricsOverviewProps) {
  return (
    <AppShell activeNav="Métricas" eyebrow="Desempenho operacional" title="Metricas">
      <section className="page-intro">
        <div>
          <span className="data-label">Organizacao atual</span>
          <h2>Indicadores manuais que sustentam a leitura da operacao</h2>
        </div>
        <p>
          Cadastre metricas reais da organizacao enquanto conectores externos
          ainda nao alimentam o dashboard automaticamente.
        </p>
      </section>

      {!hasOrganization ? (
        <section className="module-empty-state">
          <span className="data-label">Organizacao necessaria</span>
          <h2>Nenhuma organizacao ativa foi encontrada</h2>
          <p>
            Crie ou acesse uma organizacao antes de registrar metricas manuais
            para o dashboard.
          </p>
          <Link className="primary-action" href="/configuracoes">
            Ir para configuracoes
          </Link>
        </section>
      ) : loadError ? (
        <section className="screen-state error">
          <span className="data-label">Falha na leitura</span>
          <h3>Nao foi possivel carregar as metricas manuais</h3>
          <p>{loadError}</p>
        </section>
      ) : (
        <ManualMetricsWorkflow initialMetrics={initialMetrics} />
      )}
    </AppShell>
  );
}
