import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { ActionPlanDraftForm } from "@/features/action-plans/components/action-plan-draft-form";
import { organizationDashboardFixture } from "@/features/dashboard/data/organization-dashboard-fixture";
import type {
  Bottleneck,
  HealthStatus,
  PlanStatus,
  TrendDirection,
} from "@/features/dashboard/types/organization-dashboard-types";

type BottleneckDetailProps = {
  bottleneck: Bottleneck;
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

const planStatusLabels: Record<PlanStatus, string> = {
  completed: "Concluído",
  in_progress: "Em andamento",
  not_started: "Não iniciado",
};

export function BottleneckDetail({ bottleneck }: BottleneckDetailProps) {
  const relatedPlans = organizationDashboardFixture.actionPlans.filter(
    (plan) => plan.areaSlug === bottleneck.slug,
  );

  return (
    <AppShell
      activeNav="Dashboard"
      eyebrow="Detalhe do gargalo"
      title={bottleneck.areaName}
    >
      <nav className="breadcrumb" aria-label="Navegação estrutural">
        <Link href="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span>Gargalos</span>
        <span aria-hidden="true">/</span>
        <strong>{bottleneck.areaName}</strong>
      </nav>

      <section className="bottleneck-detail-header">
        <div>
          <div className="detail-status-line">
            <span className={`health-state ${bottleneck.status}`}>
              {healthLabels[bottleneck.status]}
            </span>
            <span className={`trend-copy ${bottleneck.trend}`}>
              {trendLabels[bottleneck.trend]} · {bottleneck.change.toFixed(1)} no período
            </span>
          </div>
          <h2>{bottleneck.summary}</h2>
          <p>{bottleneck.recommendation}</p>
        </div>
        <div className="detail-score">
          <span>Score atual</span>
          <strong>{bottleneck.score.toFixed(1)}</strong>
          <small>/10</small>
        </div>
      </section>

      <section className="detail-grid">
        <article className="dashboard-section detail-metrics" aria-labelledby="detail-metrics-title">
          <div className="dashboard-section-heading compact-heading">
            <div>
              <span className="data-label">Evidências</span>
              <h2 id="detail-metrics-title">Métricas relacionadas</h2>
            </div>
          </div>
          {bottleneck.metrics.length > 0 ? (
            <div className="detail-metric-list">
              {bottleneck.metrics.map((metric) => (
                <div className="detail-metric-row" key={metric.id}>
                  <div>
                    <span>{metric.label}</span>
                    <small>{metric.context}</small>
                  </div>
                  <strong>{metric.value}</strong>
                  <span className={`trend-copy ${metric.trend}`}>{metric.change}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="screen-state empty compact">Ainda não há métricas relacionadas a esta área.</div>
          )}
        </article>

        <article className="dashboard-section history-section" aria-labelledby="history-title">
          <div className="dashboard-section-heading compact-heading">
            <div>
              <span className="data-label">Últimos seis meses</span>
              <h2 id="history-title">Evolução do score</h2>
            </div>
          </div>
          <div className="score-history" aria-label="Histórico mensal do score">
            {bottleneck.history.map((point) => (
              <div className="history-column" key={point.label}>
                <span>{point.score.toFixed(1)}</span>
                <div className="history-track">
                  <div style={{ height: `${point.score * 10}%` }} />
                </div>
                <small>{point.label}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-section" aria-labelledby="detail-signals-title">
        <div className="dashboard-section-heading compact-heading">
          <div>
            <span className="data-label">Ocorrências</span>
            <h2 id="detail-signals-title">Sinais que sustentam o diagnóstico</h2>
          </div>
        </div>
        {bottleneck.signals.length > 0 ? (
          <div className="detail-signal-list">
            {bottleneck.signals.map((signal) => (
              <article className="detail-signal-row" key={signal.id}>
                <span className={`signal-marker ${signal.severity}`} />
                <div>
                  <strong>{signal.title}</strong>
                  <p>{signal.description}</p>
                </div>
                <time>{signal.detectedAt}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className="screen-state empty compact">Nenhum sinal ativo nesta área.</div>
        )}
      </section>

      <section className="dashboard-section" id="plano-de-acao" aria-labelledby="action-plan-title">
        <div className="dashboard-section-heading">
          <div>
            <span className="data-label">Resposta operacional</span>
            <h2 id="action-plan-title">Plano de ação</h2>
          </div>
          <span>{relatedPlans.length} relacionado</span>
        </div>

        {relatedPlans.length > 0 ? (
          <div className="related-plans">
            {relatedPlans.map((plan) => (
              <article className="related-plan" key={plan.id}>
                <div>
                  <span className={`plan-status ${plan.status}`}>
                    {planStatusLabels[plan.status]}
                  </span>
                  <h3>{plan.title}</h3>
                  <p>{plan.responsible} · Prazo {plan.dueDate}</p>
                </div>
                <div>
                  <strong>{plan.progress}%</strong>
                  <progress max="100" value={plan.progress} />
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <div className="plan-draft-heading">
          <span className="data-label">Novo rascunho</span>
          <h3>Transformar diagnóstico em execução</h3>
          <p>Defina um resultado, responsável e prazo para esta prioridade.</p>
        </div>
        <ActionPlanDraftForm
          areaName={bottleneck.areaName}
          recommendation={bottleneck.recommendation}
        />
      </section>
    </AppShell>
  );
}
