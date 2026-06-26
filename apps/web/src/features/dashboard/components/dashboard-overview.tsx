import { BrandLogo } from "@/components/brand-logo";

type HealthStatus = "critical" | "attention" | "healthy";

type AreaScore = {
  area: string;
  score: number;
  status: HealthStatus;
  insight: string;
};

type ActionPlan = {
  title: string;
  owner: string;
  dueDate: string;
  status: "not_started" | "in_progress" | "completed";
};

type PipelineStage = {
  label: string;
  value: number;
};

const areaScores: AreaScore[] = [
  {
    area: "Comercial",
    score: 4.2,
    status: "critical",
    insight: "Baixa previsibilidade no funil e pouca disciplina de follow-up.",
  },
  {
    area: "Marketing",
    score: 5.8,
    status: "attention",
    insight: "Campanhas geram volume, mas a qualificação ainda é irregular.",
  },
  {
    area: "Financeiro",
    score: 6.4,
    status: "attention",
    insight: "Indicadores existem, porém sem rotina clara de análise.",
  },
  {
    area: "Operação",
    score: 7.6,
    status: "healthy",
    insight: "Processos principais documentados e com execução consistente.",
  },
  {
    area: "Gestão",
    score: 6.9,
    status: "attention",
    insight: "Reuniões acontecem, mas decisões ainda ficam pouco rastreáveis.",
  },
  {
    area: "Atendimento",
    score: 8.1,
    status: "healthy",
    insight: "Boa percepção de cliente e tempo de resposta controlado.",
  },
  {
    area: "Recursos Humanos",
    score: 6.1,
    status: "attention",
    insight: "Papéis definidos, com lacunas em treinamento e avaliação.",
  },
];

const actionPlans: ActionPlan[] = [
  {
    title: "Padronizar cadência de follow-up comercial",
    owner: "Marina Alves",
    dueDate: "03 jul",
    status: "in_progress",
  },
  {
    title: "Criar score mínimo de qualificação de leads",
    owner: "Rafael Costa",
    dueDate: "08 jul",
    status: "not_started",
  },
  {
    title: "Revisar DRE gerencial com a liderança",
    owner: "Pedro Lima",
    dueDate: "12 jul",
    status: "completed",
  },
];

const pipeline: PipelineStage[] = [
  { label: "Lead", value: 42 },
  { label: "Diagnóstico", value: 18 },
  { label: "Reunião", value: 11 },
  { label: "Proposta", value: 7 },
  { label: "Fechado", value: 3 },
];

const kpis = [
  { label: "Score geral", value: "6.4", sub: "Atenção", tone: "attention" },
  { label: "Principal gargalo", value: "Comercial", sub: "4.2/10", tone: "critical" },
  { label: "Segunda prioridade", value: "Marketing", sub: "5.8/10", tone: "attention" },
  { label: "Planos ativos", value: "12", sub: "7 em andamento", tone: "healthy" },
];

const navItems = [
  "Dashboard",
  "Clientes",
  "Diagnósticos",
  "Planos",
  "Relatórios",
  "CRM",
];

const statusLabel: Record<ActionPlan["status"], string> = {
  completed: "Concluído",
  in_progress: "Em andamento",
  not_started: "Não iniciado",
};

const statusClass: Record<HealthStatus, string> = {
  attention: "is-attention",
  critical: "is-critical",
  healthy: "is-healthy",
};

export function DashboardOverview() {
  const maxPipelineValue = Math.max(...pipeline.map((stage) => stage.value));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <BrandLogo />
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              className={item === "Dashboard" ? "sidebar-link active" : "sidebar-link"}
              href="/"
              key={item}
            >
              <span className="sidebar-dot" />
              {item}
            </a>
          ))}
        </nav>
        <div className="sidebar-card">
          <div className="eyebrow">Próxima rotina</div>
          <strong>Revisão executiva</strong>
          <span>Hoje, 14:30</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <BrandLogo compact />
          </div>
          <div>
            <div className="eyebrow">Empresa selecionada</div>
            <h1>Kairos Performance Lab</h1>
          </div>
          <div className="topbar-actions">
            <button className="period-button" type="button">
              Junho 2026
            </button>
            <div className="avatar" aria-label="Consultor Pedro">
              P
            </div>
          </div>
        </header>

        <section className="hero-panel">
          <div>
            <div className="badge">Diagnóstico 360 ativo</div>
            <h2>Visão executiva do negócio</h2>
            <p>
              Score consolidado, gargalos, prioridade de atuação e plano de ação
              em uma tela pronta para rotina consultiva.
            </p>
          </div>
          <div className="score-orbit" aria-label="Score geral 6.4 de 10">
            <span>6.4</span>
            <small>/10</small>
          </div>
        </section>

        <section className="kpi-grid" aria-label="Indicadores principais">
          {kpis.map((kpi) => (
            <article className={`kpi-card ${kpi.tone}`} key={kpi.label}>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-sub">{kpi.sub}</div>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel panel-large">
            <div className="panel-header">
              <div>
                <div className="section-title">Scores por área</div>
                <h3>Ranking de gargalos</h3>
              </div>
              <span className="panel-note">menor score primeiro</span>
            </div>
            <div className="area-list">
              {areaScores.map((item) => (
                <div className="area-row" key={item.area}>
                  <div className="area-row-main">
                    <span className={`status-dot ${statusClass[item.status]}`} />
                    <div>
                      <strong>{item.area}</strong>
                      <p>{item.insight}</p>
                    </div>
                  </div>
                  <div className="area-score">
                    <span>{item.score.toFixed(1)}</span>
                    <div className="mini-track">
                      <div
                        className={statusClass[item.status]}
                        style={{ width: `${item.score * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside className="panel">
            <div className="panel-header">
              <div>
                <div className="section-title">IA consultiva</div>
                <h3>Resumo para revisão</h3>
              </div>
            </div>
            <div className="ai-card">
              <strong>Prioridade recomendada</strong>
              <p>
                Atuar primeiro no Comercial, estruturando cadência, critérios de
                qualificação e previsibilidade de conversão antes de aumentar
                investimento em campanhas.
              </p>
            </div>
            <div className="risk-list">
              <span>Risco: perda de leads por atraso no retorno</span>
              <span>Oportunidade: rotina semanal de pipeline</span>
              <span>Validação humana obrigatória antes do relatório</span>
            </div>
          </aside>
        </section>

        <section className="content-grid lower-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="section-title">CRM</div>
                <h3>Pipeline comercial</h3>
              </div>
            </div>
            <div className="pipeline-list">
              {pipeline.map((stage) => (
                <div className="pipeline-row" key={stage.label}>
                  <div>
                    <strong>{stage.label}</strong>
                    <span>{stage.value} oportunidades</span>
                  </div>
                  <div className="pipeline-track">
                    <div style={{ width: `${(stage.value / maxPipelineValue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="section-title">Planos de ação</div>
                <h3>Próximas entregas</h3>
              </div>
            </div>
            <div className="action-list">
              {actionPlans.map((plan) => (
                <div className="action-item" key={plan.title}>
                  <div>
                    <strong>{plan.title}</strong>
                    <span>
                      {plan.owner} · {plan.dueDate}
                    </span>
                  </div>
                  <small className={`plan-status ${plan.status}`}>
                    {statusLabel[plan.status]}
                  </small>
                </div>
              ))}
            </div>
          </article>

          <article className="panel state-panel">
            <div className="panel-header">
              <div>
                <div className="section-title">Estados de tela</div>
                <h3>Pronto para API</h3>
              </div>
            </div>
            <div className="state-list">
              <span>Loading: skeleton escuro com borda sutil</span>
              <span>Error: card vermelho com ação de tentar novamente</span>
              <span>Empty: mensagem curta e CTA primário</span>
              <span>Success: conteúdo denso com indicadores e contexto</span>
            </div>
          </article>
        </section>
      </main>

      <nav className="bottom-nav" aria-label="Navegação mobile">
        {navItems.slice(0, 4).map((item) => (
          <a className={item === "Dashboard" ? "active" : ""} href="/" key={item}>
            <span />
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}
