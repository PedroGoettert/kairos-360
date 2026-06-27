import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import type { Company } from "@/features/companies/types/company-types";
import type {
  ActionPlanStatus,
  CompanyDashboard,
  HealthStatus,
} from "@/features/dashboard/types/dashboard-types";

type DashboardOverviewProps = {
  companies: Company[];
  dashboard: CompanyDashboard | null;
  loadError?: string;
};

const healthLabel: Record<HealthStatus, string> = {
  attention: "Atencao",
  critical: "Critico",
  healthy: "Saudavel",
};

const planStatusLabel: Record<ActionPlanStatus, string> = {
  completed: "Concluido",
  in_progress: "Em andamento",
  not_started: "Nao iniciado",
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Sem prazo";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
}

function getHealthStatus(score: number): HealthStatus {
  if (score < 5) {
    return "critical";
  }

  if (score < 7.5) {
    return "attention";
  }

  return "healthy";
}

export function DashboardOverview({
  companies,
  dashboard,
  loadError,
}: DashboardOverviewProps) {
  if (loadError) {
    return (
      <AppShell activeNav="Dashboard" eyebrow="Visao operacional" title="Dashboard">
        <section className="panel screen-state error" role="alert">
          <div className="section-title">Falha na integracao</div>
          <h3>Nao foi possivel carregar o backend</h3>
          <p>{loadError}</p>
        </section>
      </AppShell>
    );
  }

  if (!dashboard) {
    return (
      <AppShell activeNav="Dashboard" eyebrow="Visao operacional" title="Dashboard">
        <section className="hero-panel">
          <div>
            <div className="badge">Ambiente conectado</div>
            <h2>Comece pela primeira empresa</h2>
            <p>O backend esta acessivel, mas ainda nao existe uma empresa para consolidar.</p>
          </div>
        </section>
        <section className="panel screen-state empty">
          <div className="section-title">Sem dados</div>
          <h3>Cadastre um cliente para iniciar</h3>
          <p>O dashboard sera preenchido com diagnosticos, scores e planos reais.</p>
          <Link className="primary-action inline-action" href="/clientes">
            Ir para clientes
          </Link>
        </section>
      </AppShell>
    );
  }

  const scores = dashboard.latestScores;
  const health = dashboard.healthClassification;
  const activePlans = dashboard.actionPlans.notStarted + dashboard.actionPlans.inProgress;

  return (
    <AppShell
      activeNav="Dashboard"
      eyebrow="Empresa selecionada"
      title={dashboard.company.tradeName ?? dashboard.company.name}
    >
      {companies.length > 1 ? (
        <nav className="company-switcher" aria-label="Selecionar empresa">
          {companies.map((company) => (
            <Link
              className={company.id === dashboard.company.id ? "active" : ""}
              href={`/dashboard?companyId=${company.id}`}
              key={company.id}
            >
              {company.tradeName ?? company.name}
            </Link>
          ))}
        </nav>
      ) : null}

      <section className="hero-panel">
        <div>
          <div className="badge">Dados consolidados da API</div>
          <h2>{scores ? "Visao executiva do diagnostico" : "Empresa pronta para o baseline"}</h2>
          <p>
            {scores
              ? "Scores, gargalos e planos abaixo refletem o ultimo diagnostico concluido."
              : "Crie e finalize um diagnostico para calcular os primeiros indicadores."}
          </p>
        </div>
        <div className="score-orbit" aria-label={scores ? `Score geral ${scores.generalScore} de 10` : "Score ainda nao calculado"}>
          <span>{scores?.generalScore.toFixed(1) ?? "--"}</span>
          <small>/10</small>
        </div>
      </section>

      <section className="kpi-grid" aria-label="Indicadores principais">
        <article className={`kpi-card ${health ?? "neutral"}`}>
          <div className="kpi-label">Saude geral</div>
          <div className="kpi-value">{health ? healthLabel[health] : "Sem baseline"}</div>
          <div className="kpi-sub">{scores ? `${scores.generalScore.toFixed(1)}/10` : "aguardando diagnostico"}</div>
        </article>
        <article className="kpi-card critical">
          <div className="kpi-label">Principal gargalo</div>
          <div className="kpi-value">{scores?.mainBottleneck.areaName ?? "--"}</div>
          <div className="kpi-sub">{scores ? `${scores.mainBottleneck.score.toFixed(1)}/10` : "sem score"}</div>
        </article>
        <article className="kpi-card attention">
          <div className="kpi-label">Segunda prioridade</div>
          <div className="kpi-value">{scores?.secondPriority?.areaName ?? "--"}</div>
          <div className="kpi-sub">{scores?.secondPriority ? `${scores.secondPriority.score.toFixed(1)}/10` : "sem score"}</div>
        </article>
        <article className="kpi-card healthy">
          <div className="kpi-label">Planos ativos</div>
          <div className="kpi-value">{activePlans}</div>
          <div className="kpi-sub">{dashboard.actionPlans.inProgress} em andamento</div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel panel-large">
          <div className="panel-header">
            <div>
              <div className="section-title">Scores por area</div>
              <h3>Ranking de gargalos</h3>
            </div>
            <span className="panel-note">menor score primeiro</span>
          </div>
          {scores ? (
            <div className="area-list">
              {[...scores.scores]
                .sort((left, right) => left.score - right.score)
                .map((item) => {
                  const status = getHealthStatus(item.score);

                  return (
                    <div className="area-row" key={item.areaId}>
                      <div className="area-row-main">
                        <span className={`status-dot is-${status}`} />
                        <div>
                          <strong>{item.areaName}</strong>
                          <p>{healthLabel[status]}</p>
                        </div>
                      </div>
                      <div className="area-score">
                        <span>{item.score.toFixed(1)}</span>
                        <div className="mini-track">
                          <div className={`is-${status}`} style={{ width: `${item.score * 10}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="screen-state empty compact">Nenhum score calculado.</div>
          )}
        </article>

        <aside className="panel">
          <div className="panel-header">
            <div>
              <div className="section-title">Diagnosticos</div>
              <h3>Estado do baseline</h3>
            </div>
          </div>
          <div className="detail-list">
            <div><span>Total</span><strong>{dashboard.diagnostics.total}</strong></div>
            <div><span>Concluidos</span><strong>{dashboard.diagnostics.completed}</strong></div>
            <div><span>Em rascunho</span><strong>{dashboard.diagnostics.draft}</strong></div>
            <div>
              <span>Ultima conclusao</span>
              <strong>{formatDate(dashboard.diagnostics.latestCompleted?.completedAt ?? null)}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="content-grid lower-grid dashboard-lower-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="section-title">Planos de acao</div>
              <h3>Entregas recentes</h3>
            </div>
          </div>
          {dashboard.actionPlans.recent.length > 0 ? (
            <div className="action-list">
              {dashboard.actionPlans.recent.map((plan) => (
                <div className="action-item" key={plan.id}>
                  <div>
                    <strong>{plan.title}</strong>
                    <span>{plan.responsible ?? "Sem responsavel"} · {formatDate(plan.dueDate)}</span>
                  </div>
                  <small className={`plan-status ${plan.status}`}>{planStatusLabel[plan.status]}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="screen-state empty compact">Nenhum plano de acao criado.</div>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="section-title">Empresa</div>
              <h3>Contexto do cliente</h3>
            </div>
          </div>
          <div className="detail-list">
            <div><span>Razao social</span><strong>{dashboard.company.name}</strong></div>
            <div><span>Nome fantasia</span><strong>{dashboard.company.tradeName ?? "Nao informado"}</strong></div>
            <div><span>Segmento</span><strong>{dashboard.company.industry ?? "Nao informado"}</strong></div>
          </div>
          <div className="next-actions">
            <Link href="/clientes">Voltar para carteira</Link>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
