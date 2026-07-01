import { AppShell } from "@/components/app-shell";
import { organizationDashboardFixture as snapshot } from "@/features/dashboard/data/organization-dashboard-fixture";

export function MetricsOverview() {
  return (
    <AppShell activeNav="Métricas" eyebrow="Desempenho operacional" title="Métricas">
      <section className="page-intro">
        <div><span className="data-label">Últimos 30 dias</span><h2>Indicadores que sustentam a leitura da operação</h2></div>
        <p>Valores manuais e calculados organizados por contexto, tendência e meta.</p>
      </section>
      <section className="dashboard-section" aria-labelledby="headline-metrics-title">
        <div className="dashboard-section-heading"><div><h2 id="headline-metrics-title">Indicadores essenciais</h2></div><span>{snapshot.headlineMetrics.length} monitorados</span></div>
        <div className="metric-strip">
          {snapshot.headlineMetrics.map((metric) => (
            <article className="metric-summary" key={metric.id}>
              <span>{metric.label}</span><strong>{metric.value}</strong>
              <div><span className={`trend-copy ${metric.trend}`}>{metric.change}</span><small>{metric.context}</small></div>
            </article>
          ))}
        </div>
      </section>
      <section className="dashboard-section" aria-labelledby="area-metrics-title">
        <div className="dashboard-section-heading"><div><h2 id="area-metrics-title">Métricas por área</h2></div></div>
        <div className="operations-list">
          {snapshot.bottlenecks.filter((area) => area.metrics.length > 0).map((area) => (
            <article className="operations-row" key={area.slug}>
              <div><strong>{area.areaName}</strong><span>Score {area.score.toFixed(1)}</span></div>
              <div className="operations-values">{area.metrics.map((metric) => <span key={metric.id}><small>{metric.label}</small><strong>{metric.value}</strong></span>)}</div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
