import { AppShell } from "@/components/app-shell";
import { NewClientForm } from "@/features/companies/components/new-client-form";

type ClientStatus = "critical" | "attention" | "healthy";

type Client = {
  id: string;
  name: string;
  segment: string;
  owner: string;
  score: number;
  status: ClientStatus;
  mainBottleneck: string;
  lastDiagnostic: string;
  activePlans: number;
  stage: string;
};

const clients: Client[] = [
  {
    id: "CLI-1042",
    name: "Kairos Performance Lab",
    segment: "Consultoria",
    owner: "Pedro Lima",
    score: 6.4,
    status: "attention",
    mainBottleneck: "Comercial",
    lastDiagnostic: "24 jun 2026",
    activePlans: 7,
    stage: "Diagnóstico",
  },
  {
    id: "CLI-1039",
    name: "Norte Solar Energia",
    segment: "Energia",
    owner: "Marina Alves",
    score: 4.8,
    status: "critical",
    mainBottleneck: "Financeiro",
    lastDiagnostic: "18 jun 2026",
    activePlans: 5,
    stage: "Plano de ação",
  },
  {
    id: "CLI-1034",
    name: "Vitta Odonto Prime",
    segment: "Saúde",
    owner: "Rafael Costa",
    score: 7.9,
    status: "healthy",
    mainBottleneck: "Marketing",
    lastDiagnostic: "11 jun 2026",
    activePlans: 3,
    stage: "Acompanhamento",
  },
  {
    id: "CLI-1028",
    name: "Atlas Food Service",
    segment: "Alimentação",
    owner: "Bianca Rocha",
    score: 5.6,
    status: "attention",
    mainBottleneck: "Operação",
    lastDiagnostic: "03 jun 2026",
    activePlans: 9,
    stage: "Reunião",
  },
  {
    id: "CLI-1017",
    name: "Mova Educação Corporativa",
    segment: "Educação",
    owner: "Pedro Lima",
    score: 8.3,
    status: "healthy",
    mainBottleneck: "Recursos Humanos",
    lastDiagnostic: "28 mai 2026",
    activePlans: 2,
    stage: "Relatório",
  },
];

const statusLabel: Record<ClientStatus, string> = {
  attention: "Atenção",
  critical: "Crítico",
  healthy: "Saudável",
};

const statusClass: Record<ClientStatus, string> = {
  attention: "is-attention",
  critical: "is-critical",
  healthy: "is-healthy",
};

const portfolioKpis = [
  { label: "Clientes ativos", value: "38", sub: "5 com diagnóstico recente", tone: "healthy" },
  { label: "Score médio", value: "6.7", sub: "Atenção operacional", tone: "attention" },
  { label: "Críticos", value: "6", sub: "prioridade da semana", tone: "critical" },
  { label: "Planos abertos", value: "42", sub: "18 em andamento", tone: "attention" },
];

const selectedClient = clients[0];

export function ClientsPage() {
  return (
    <AppShell activeNav="Clientes" eyebrow="Carteira multiempresa" title="Clientes">
      <section className="hero-panel clients-hero">
        <div>
          <div className="badge">Base consultiva</div>
          <h2>Empresas em acompanhamento</h2>
          <p>
            Consulte saúde do negócio, gargalo principal, estágio do relacionamento
            e próximos passos por cliente.
          </p>
        </div>
      </section>

      <NewClientForm />

      <section className="kpi-grid" aria-label="Indicadores da carteira">
        {portfolioKpis.map((kpi) => (
          <article className={`kpi-card ${kpi.tone}`} key={kpi.label}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-sub">{kpi.sub}</div>
          </article>
        ))}
      </section>

      <section className="client-layout">
        <article className="panel client-list-panel">
          <div className="panel-header client-panel-header">
            <div>
              <div className="section-title">Lista de clientes</div>
              <h3>Carteira atual</h3>
            </div>
            <span className="panel-note">{clients.length} registros</span>
          </div>

          <div className="client-toolbar">
            <label className="search-field">
              <span>Buscar</span>
              <input placeholder="Empresa, segmento ou responsável" type="search" />
            </label>
            <div className="filter-bar">
              <button className="filter-chip active" type="button">
                Todos
              </button>
              <button className="filter-chip" type="button">
                Críticos
              </button>
              <button className="filter-chip" type="button">
                Atenção
              </button>
              <button className="filter-chip" type="button">
                Saudáveis
              </button>
            </div>
          </div>

          <div className="client-table" role="table">
            <div className="client-table-head" role="row">
              <span>Empresa</span>
              <span>Score</span>
              <span>Gargalo</span>
              <span>Responsável</span>
              <span>Último diagnóstico</span>
            </div>
            {clients.map((client) => (
              <a
                className={
                  client.id === selectedClient.id ? "client-row active" : "client-row"
                }
                href={`/clientes/${client.id}`}
                key={client.id}
                role="row"
              >
                <span className="client-company">
                  <strong>{client.name}</strong>
                  <small>
                    {client.id} · {client.segment}
                  </small>
                </span>
                <span className="client-score">
                  <span className={`status-dot ${statusClass[client.status]}`} />
                  {client.score.toFixed(1)}
                </span>
                <span>{client.mainBottleneck}</span>
                <span>{client.owner}</span>
                <span>{client.lastDiagnostic}</span>
              </a>
            ))}
          </div>
        </article>

        <aside className="panel client-detail-panel">
          <div className="panel-header">
            <div>
              <div className="section-title">Cliente selecionado</div>
              <h3>{selectedClient.name}</h3>
            </div>
            <span className={`client-status ${selectedClient.status}`}>
              {statusLabel[selectedClient.status]}
            </span>
          </div>

          <div className="client-detail-score">
            <div>
              <span>Score geral</span>
              <strong>{selectedClient.score.toFixed(1)}</strong>
            </div>
            <div className="mini-track">
              <div
                className={statusClass[selectedClient.status]}
                style={{ width: `${selectedClient.score * 10}%` }}
              />
            </div>
          </div>

          <div className="detail-list">
            <div>
              <span>Gargalo principal</span>
              <strong>{selectedClient.mainBottleneck}</strong>
            </div>
            <div>
              <span>Estágio atual</span>
              <strong>{selectedClient.stage}</strong>
            </div>
            <div>
              <span>Planos ativos</span>
              <strong>{selectedClient.activePlans}</strong>
            </div>
            <div>
              <span>Consultor responsável</span>
              <strong>{selectedClient.owner}</strong>
            </div>
          </div>

          <div className="next-actions">
            <div className="section-title">Próximas ações</div>
            <a href={`/clientes/${selectedClient.id}/diagnosticos`}>
              Abrir diagnóstico
            </a>
            <a href={`/clientes/${selectedClient.id}/dashboard`}>
              Ver dashboard do cliente
            </a>
            <a href={`/clientes/${selectedClient.id}/planos-de-acao`}>
              Revisar planos de ação
            </a>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
