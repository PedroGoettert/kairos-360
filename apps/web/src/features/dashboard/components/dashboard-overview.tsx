import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DashboardCharts } from "@/features/dashboard/components/dashboard-charts";
import type { HealthStatus, OrganizationDashboardSnapshot } from "@/features/dashboard/types/organization-dashboard-types";

type DashboardOverviewProps = {
  snapshot: OrganizationDashboardSnapshot | null;
};

const healthLabels: Record<HealthStatus, string> = {
  attention: "Atenção",
  critical: "Crítico",
  healthy: "Saudável",
};

export function DashboardOverview({ snapshot }: DashboardOverviewProps) {
  if (!snapshot) {
    return <AppShell activeNav="Dashboard" eyebrow="Saúde da organização" title="Dashboard"><section className="module-empty-state"><span className="data-label">Baseline necessário</span><h2>A saúde organizacional ainda não foi calculada</h2><p>Conclua a primeira aplicação do baseline para gerar o score geral e o ranking de gargalos.</p><Link className="primary-action" href="/baseline">Ir para o baseline</Link></section></AppShell>;
  }
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
          <strong>Baseline organizacional</strong>
          <span>Atualizado {snapshot.connection.lastUpdatedLabel}</span>
        </div>
        <div className="dashboard-period">
          <span>Fonte atual</span>
          <strong>Diagnóstico manual</strong>
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
          <p className="trend-copy stable">Referência atual da organização</p>
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
              <span>Origem</span>
              <strong>Baseline</strong>
            </div>
            <div>
              <span>Prioridade</span>
              <strong>01</strong>
            </div>
          </div>
          {primaryBottleneck ? (
            <Link
              className="primary-action dashboard-primary-action"
              href="/baseline"
            >
              Ver resultado completo
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
            <span>Fonte</span>
            <span>Impacto</span>
            <span>Ação</span>
          </div>
          {snapshot.bottlenecks.map((bottleneck) => (
            <Link
              className="bottleneck-row"
              href="/baseline"
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
              <span>Baseline</span>
              <span>{bottleneck.impact === "high" ? "Alto" : bottleneck.impact === "medium" ? "Médio" : "Baixo"}</span>
              <span className="row-action">Detalhar</span>
            </Link>
          ))}
        </div>
      </section>

      <nav className="dashboard-route-strip" aria-label="Áreas de acompanhamento">
        <Link href="/metricas"><span>Métricas</span><strong>Aguardando métricas manuais</strong></Link>
        <Link href="/sinais"><span>Sinais</span><strong>Aguardando camada de sinais</strong></Link>
        <Link href="/planos"><span>Planos</span><strong>Aguardando domínio organizacional</strong></Link>
      </nav>
    </AppShell>
  );
}
