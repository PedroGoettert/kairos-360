import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DashboardCharts } from "@/features/dashboard/components/dashboard-charts";
import type {
  DashboardActionPlan,
  DashboardMetric,
  DashboardSignal,
  HealthStatus,
  OrganizationDashboardSnapshot,
} from "@/features/dashboard/types/organization-dashboard-types";

type DashboardOverviewProps = {
  snapshot: OrganizationDashboardSnapshot | null;
};

const healthLabels: Record<HealthStatus, string> = {
  attention: "Atencao",
  critical: "Critico",
  healthy: "Saudavel",
};

function getMetricsSummary(metrics: DashboardMetric[]) {
  if (metrics.length === 0) {
    return "Aguardando metricas manuais";
  }

  return `${metrics.length} metrica${metrics.length > 1 ? "s" : ""} manual${metrics.length > 1 ? "is" : ""} ativa${metrics.length > 1 ? "s" : ""}`;
}

function getSignalsSummary(signals: DashboardSignal[]) {
  if (signals.length === 0) {
    return "Aguardando camada de sinais";
  }

  return `${signals.length} sinal${signals.length > 1 ? "is" : ""} recente${signals.length > 1 ? "s" : ""}`;
}

function getActionPlansSummary(actionPlans: DashboardActionPlan[]) {
  if (actionPlans.length === 0) {
    return "Aguardando dominio organizacional";
  }

  return `${actionPlans.length} plano${actionPlans.length > 1 ? "s" : ""} em acompanhamento`;
}

function DashboardRouteStrip({ snapshot }: { snapshot: OrganizationDashboardSnapshot }) {
  return (
    <nav className="dashboard-route-strip" aria-label="Areas de acompanhamento">
      <Link href="/metricas">
        <span>Metricas</span>
        <strong>{getMetricsSummary(snapshot.headlineMetrics)}</strong>
      </Link>
      <Link href="/sinais">
        <span>Sinais</span>
        <strong>{getSignalsSummary(snapshot.recentSignals)}</strong>
      </Link>
      <Link href="/planos">
        <span>Planos</span>
        <strong>{getActionPlansSummary(snapshot.actionPlans)}</strong>
      </Link>
    </nav>
  );
}

export function DashboardOverview({ snapshot }: DashboardOverviewProps) {
  if (!snapshot) {
    return (
      <AppShell activeNav="Dashboard" eyebrow="Saude da organizacao" title="Dashboard">
        <section className="module-empty-state">
          <span className="data-label">Organizacao necessaria</span>
          <h2>Nenhuma organizacao ativa foi encontrada</h2>
          <p>Crie ou acesse uma organizacao para acompanhar a saude operacional no dashboard.</p>
          <Link className="primary-action" href="/configuracoes">
            Ir para configuracoes
          </Link>
        </section>
      </AppShell>
    );
  }

  if (!snapshot.health) {
    return (
      <AppShell
        activeNav="Dashboard"
        eyebrow="Saude da organizacao"
        title={snapshot.organization.tradeName}
      >
        <section className="dashboard-statusbar" aria-label="Estado da atualizacao">
          <div className="connection-status">
            <span className={`connection-dot ${snapshot.connection.status}`} />
            <strong>Baseline organizacional</strong>
            <span>Atualizado {snapshot.connection.lastUpdatedLabel}</span>
          </div>
          <div className="dashboard-period">
            <span>Fonte atual</span>
            <strong>Diagnostico manual</strong>
          </div>
        </section>

        <section className="module-empty-state">
          <span className="data-label">Baseline necessario</span>
          <h2>A saude organizacional ainda nao foi calculada</h2>
          <p>Conclua a primeira aplicacao do baseline para gerar o score geral e o ranking de gargalos.</p>
          <Link className="primary-action" href="/baseline">
            Ir para o baseline
          </Link>
        </section>

        <DashboardRouteStrip snapshot={snapshot} />
      </AppShell>
    );
  }

  const primaryBottleneck = snapshot.bottlenecks[0];

  return (
    <AppShell
      activeNav="Dashboard"
      eyebrow="Saude da organizacao"
      title={snapshot.organization.tradeName}
    >
      <section className="dashboard-statusbar" aria-label="Estado da atualizacao">
        <div className="connection-status">
          <span className={`connection-dot ${snapshot.connection.status}`} />
          <strong>Baseline organizacional</strong>
          <span>Atualizado {snapshot.connection.lastUpdatedLabel}</span>
        </div>
        <div className="dashboard-period">
          <span>Fonte atual</span>
          <strong>Diagnostico manual</strong>
        </div>
      </section>

      <section className="executive-summary" aria-labelledby="executive-title">
        <div className="health-score-block">
          <span className="data-label">Saude geral</span>
          <div className="health-score-line">
            <strong>{snapshot.health.score.toFixed(1)}</strong>
            <span>/10</span>
          </div>
          <div className={`health-state ${snapshot.health.status}`}>
            {healthLabels[snapshot.health.status]}
          </div>
          <p className="trend-copy stable">Referencia atual da organizacao</p>
        </div>

        <div className="executive-priority">
          <div className="priority-heading">
            <div>
              <span className="data-label">Prioridade atual</span>
              <h2 id="executive-title">{primaryBottleneck?.areaName ?? "Sem gargalos identificados"}</h2>
            </div>
            <span className="priority-rank">{primaryBottleneck ? "01" : "--"}</span>
          </div>
          <p>{primaryBottleneck?.summary ?? "Conclua mais leituras do baseline para destacar prioridades da operacao."}</p>
          <div className="priority-evidence">
            <div>
              <span>Score</span>
              <strong>{primaryBottleneck ? primaryBottleneck.score.toFixed(1) : "--"}</strong>
            </div>
            <div>
              <span>Origem</span>
              <strong>Baseline</strong>
            </div>
            <div>
              <span>Prioridade</span>
              <strong>{primaryBottleneck ? "01" : "--"}</strong>
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
            <h2 id="bottlenecks-title">Gargalos da operacao</h2>
          </div>
          <span>{snapshot.bottlenecks.length} areas monitoradas</span>
        </div>

        <div className="bottleneck-table" aria-label="Ranking de gargalos">
          <div className="bottleneck-table-head">
            <span>Prioridade</span>
            <span>Area</span>
            <span>Score</span>
            <span>Fonte</span>
            <span>Impacto</span>
            <span>Acao</span>
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
              <span>{bottleneck.impact === "high" ? "Alto" : bottleneck.impact === "medium" ? "Medio" : "Baixo"}</span>
              <span className="row-action">Detalhar</span>
            </Link>
          ))}
        </div>
      </section>

      <DashboardRouteStrip snapshot={snapshot} />
    </AppShell>
  );
}
