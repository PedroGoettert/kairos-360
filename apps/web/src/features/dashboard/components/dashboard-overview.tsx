import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DashboardCharts } from "@/features/dashboard/components/dashboard-charts";
import { organizationDashboardFixture } from "@/features/dashboard/data/organization-dashboard-fixture";
import type { HealthStatus, OrganizationDashboardSnapshot, TrendDirection } from "@/features/dashboard/types/organization-dashboard-types";

type DashboardOverviewProps = {
  snapshot?: OrganizationDashboardSnapshot;
};

const healthLabels: Record<HealthStatus, string> = {
  attention: "Atenção",
  critical: "Crítico",
  healthy: "Saudável",
};

const trendLabels: Record<TrendDirection, string> = {
  declining: "Em queda",
  improving: "Melhorando",
  stable: "Estável",
};

export function DashboardOverview({
  snapshot = organizationDashboardFixture,
}: DashboardOverviewProps) {
  const primaryBottleneck = snapshot.bottlenecks[0];
  return (
    <AppShell
      activeNav="Dashboard"
      eyebrow="Saúde da organização"
      title={snapshot.organization.tradeName}
    >
      <section className="dashboard-statusbar" aria-label="Estado da atualização">
        <div className="connection-status">
          <span className={`connection-dot ${snapshot.connection.status}`} />
          <strong>Monitoramento ativo</strong>
          <span>Atualizado {snapshot.connection.lastUpdatedLabel}</span>
        </div>
        <div className="dashboard-period">
          <span>Janela de análise</span>
          <strong>Últimos 30 dias</strong>
        </div>
      </section>

      <section className="executive-summary" aria-labelledby="executive-title">
        <div className="health-score-block">
          <span className="data-label">Saúde geral</span>
          <div className="health-score-line">
            <strong>{snapshot.health.score.toFixed(1)}</strong>
            <span>/10</span>
          </div>
          <div className={`health-state ${snapshot.health.status}`}>
            {healthLabels[snapshot.health.status]}
          </div>
          <p className={`trend-copy ${snapshot.health.trend}`}>
            {trendLabels[snapshot.health.trend]} · {snapshot.health.change.toFixed(1)} no período
          </p>
        </div>

        <div className="executive-priority">
          <div className="priority-heading">
            <div>
              <span className="data-label">Prioridade atual</span>
              <h2 id="executive-title">{primaryBottleneck?.areaName}</h2>
            </div>
            <span className="priority-rank">01</span>
          </div>
          <p>{primaryBottleneck?.summary}</p>
          <div className="priority-evidence">
            <div>
              <span>Score</span>
              <strong>{primaryBottleneck?.score.toFixed(1)}</strong>
            </div>
            <div>
              <span>Variação</span>
              <strong>{primaryBottleneck?.change.toFixed(1)}</strong>
            </div>
            <div>
              <span>Sinais ativos</span>
              <strong>{primaryBottleneck?.signals.length}</strong>
            </div>
          </div>
          {primaryBottleneck ? (
            <Link
              className="primary-action dashboard-primary-action"
              href={`/dashboard/gargalos/${primaryBottleneck.slug}`}
            >
              Investigar gargalo
            </Link>
          ) : null}
        </div>
      </section>

      <DashboardCharts bottlenecks={snapshot.bottlenecks} />

      <section className="dashboard-section" aria-labelledby="bottlenecks-title">
        <div className="dashboard-section-heading">
          <div>
            <span className="data-label">Leitura priorizada</span>
            <h2 id="bottlenecks-title">Gargalos da operação</h2>
          </div>
          <span>{snapshot.bottlenecks.length} áreas monitoradas</span>
        </div>

        <div className="bottleneck-table" aria-label="Ranking de gargalos">
          <div className="bottleneck-table-head">
            <span>Prioridade</span>
            <span>Área</span>
            <span>Score</span>
            <span>Tendência</span>
            <span>Impacto</span>
            <span>Ação</span>
          </div>
          {snapshot.bottlenecks.map((bottleneck) => (
            <Link
              className="bottleneck-row"
              href={`/dashboard/gargalos/${bottleneck.slug}`}
              key={bottleneck.slug}
            >
              <span className="bottleneck-rank">{String(bottleneck.rank).padStart(2, "0")}</span>
              <span className="bottleneck-area">
                <span className={`status-dot is-${bottleneck.status}`} />
                <span>
                  <strong>{bottleneck.areaName}</strong>
                  <small>{healthLabels[bottleneck.status]}</small>
                </span>
              </span>
              <span className="bottleneck-score">{bottleneck.score.toFixed(1)}</span>
              <span className={`trend-copy ${bottleneck.trend}`}>
                {trendLabels[bottleneck.trend]}
              </span>
              <span>{bottleneck.impact === "high" ? "Alto" : bottleneck.impact === "medium" ? "Médio" : "Baixo"}</span>
              <span className="row-action">Detalhar</span>
            </Link>
          ))}
        </div>
      </section>

      <nav className="dashboard-route-strip" aria-label="Áreas de acompanhamento">
        <Link href="/metricas"><span>Métricas</span><strong>3 indicadores essenciais</strong></Link>
        <Link href="/sinais"><span>Sinais</span><strong>{snapshot.recentSignals.length} mudanças recentes</strong></Link>
        <Link href="/planos"><span>Planos</span><strong>{snapshot.actionPlans.length} planos em acompanhamento</strong></Link>
      </nav>
    </AppShell>
  );
}
