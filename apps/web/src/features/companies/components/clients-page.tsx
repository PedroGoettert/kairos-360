"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { NewClientForm } from "@/features/companies/components/new-client-form";
import type {
  CompanyPortfolioItem,
  HealthStatus,
} from "@/features/dashboard/types/dashboard-types";

type ClientsPageProps = {
  items: CompanyPortfolioItem[];
  loadError?: string;
};

type PortfolioStatus = HealthStatus | "unassessed";

const statusLabel: Record<PortfolioStatus, string> = {
  attention: "Atencao",
  critical: "Critico",
  healthy: "Saudavel",
  unassessed: "Sem baseline",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
}

export function ClientsPage({ items, loadError }: ClientsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(items[0]?.company.id ?? null);
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    if (!normalizedQuery) {
      return items;
    }

    return items.filter(({ company }) =>
      [company.name, company.tradeName, company.industry]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("pt-BR").includes(normalizedQuery)),
    );
  }, [items, query]);
  const selected =
    items.find(({ company }) => company.id === selectedId) ?? items[0] ?? null;
  const assessed = items.filter(({ dashboard }) => dashboard?.latestScores).length;
  const critical = items.filter(
    ({ dashboard }) => dashboard?.healthClassification === "critical",
  ).length;
  const activePlans = items.reduce(
    (total, { dashboard }) =>
      total + (dashboard?.actionPlans.notStarted ?? 0) + (dashboard?.actionPlans.inProgress ?? 0),
    0,
  );
  const averageScore =
    assessed > 0
      ? items.reduce(
          (total, { dashboard }) => total + (dashboard?.latestScores?.generalScore ?? 0),
          0,
        ) / assessed
      : null;

  return (
    <AppShell activeNav="Clientes" eyebrow="Carteira multiempresa" title="Clientes">
      <section className="hero-panel clients-hero">
        <div>
          <div className="badge">Dados da API</div>
          <h2>Empresas em acompanhamento</h2>
          <p>
            A carteira abaixo reflete as empresas persistidas no backend para o usuario
            autenticado.
          </p>
        </div>
      </section>

      <NewClientForm />

      {loadError ? <div className="screen-state error" role="alert">{loadError}</div> : null}

      <section className="kpi-grid" aria-label="Indicadores da carteira">
        <article className="kpi-card healthy">
          <div className="kpi-label">Clientes</div>
          <div className="kpi-value">{items.length}</div>
          <div className="kpi-sub">registros persistidos</div>
        </article>
        <article className="kpi-card attention">
          <div className="kpi-label">Score medio</div>
          <div className="kpi-value">{averageScore?.toFixed(1) ?? "--"}</div>
          <div className="kpi-sub">{assessed} com baseline</div>
        </article>
        <article className="kpi-card critical">
          <div className="kpi-label">Criticos</div>
          <div className="kpi-value">{critical}</div>
          <div className="kpi-sub">exigem prioridade</div>
        </article>
        <article className="kpi-card attention">
          <div className="kpi-label">Planos ativos</div>
          <div className="kpi-value">{activePlans}</div>
          <div className="kpi-sub">nao iniciados ou em andamento</div>
        </article>
      </section>

      {items.length === 0 && !loadError ? (
        <section className="panel screen-state empty">
          <div className="section-title">Carteira vazia</div>
          <h3>Cadastre a primeira empresa</h3>
          <p>Use o botao Novo cliente para validar o fluxo manual sem dados de seed.</p>
        </section>
      ) : (
        <section className="client-layout">
          <article className="panel client-list-panel">
            <div className="panel-header client-panel-header">
              <div>
                <div className="section-title">Lista de clientes</div>
                <h3>Carteira atual</h3>
              </div>
              <span className="panel-note">{filteredItems.length} registros</span>
            </div>

            <div className="client-toolbar">
              <label className="search-field">
                <span>Buscar</span>
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Empresa, nome fantasia ou segmento"
                  type="search"
                  value={query}
                />
              </label>
            </div>

            {filteredItems.length === 0 ? (
              <div className="screen-state empty compact">Nenhuma empresa encontrada.</div>
            ) : (
              <div className="client-table" role="table">
                <div className="client-table-head" role="row">
                  <span>Empresa</span>
                  <span>Score</span>
                  <span>Segmento</span>
                  <span>Diagnosticos</span>
                  <span>Cadastro</span>
                </div>
                {filteredItems.map((item) => {
                  const status = item.dashboard?.healthClassification ?? "unassessed";

                  return (
                    <button
                      className={item.company.id === selected?.company.id ? "client-row active" : "client-row"}
                      key={item.company.id}
                      onClick={() => setSelectedId(item.company.id)}
                      role="row"
                      type="button"
                    >
                      <span className="client-company">
                        <strong>{item.company.tradeName ?? item.company.name}</strong>
                        <small>{item.company.name}</small>
                      </span>
                      <span className="client-score">
                        <span className={`status-dot is-${status}`} />
                        {item.dashboard?.latestScores?.generalScore.toFixed(1) ?? "--"}
                      </span>
                      <span>{item.company.industry ?? "Nao informado"}</span>
                      <span>{item.dashboard?.diagnostics.total ?? 0}</span>
                      <span>{formatDate(item.company.createdAt)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </article>

          {selected ? (
            <aside className="panel client-detail-panel">
              <div className="panel-header">
                <div>
                  <div className="section-title">Cliente selecionado</div>
                  <h3>{selected.company.tradeName ?? selected.company.name}</h3>
                </div>
                <span className={`client-status ${selected.dashboard?.healthClassification ?? "unassessed"}`}>
                  {statusLabel[selected.dashboard?.healthClassification ?? "unassessed"]}
                </span>
              </div>

              <div className="client-detail-score">
                <div>
                  <span>Score geral</span>
                  <strong>{selected.dashboard?.latestScores?.generalScore.toFixed(1) ?? "--"}</strong>
                </div>
                <div className="mini-track">
                  <div
                    className={`is-${selected.dashboard?.healthClassification ?? "unassessed"}`}
                    style={{ width: `${(selected.dashboard?.latestScores?.generalScore ?? 0) * 10}%` }}
                  />
                </div>
              </div>

              <div className="detail-list">
                <div>
                  <span>Gargalo principal</span>
                  <strong>{selected.dashboard?.latestScores?.mainBottleneck.areaName ?? "Aguardando baseline"}</strong>
                </div>
                <div>
                  <span>Diagnosticos</span>
                  <strong>{selected.dashboard?.diagnostics.total ?? 0}</strong>
                </div>
                <div>
                  <span>Planos ativos</span>
                  <strong>{(selected.dashboard?.actionPlans.notStarted ?? 0) + (selected.dashboard?.actionPlans.inProgress ?? 0)}</strong>
                </div>
                <div>
                  <span>Segmento</span>
                  <strong>{selected.company.industry ?? "Nao informado"}</strong>
                </div>
              </div>

              <div className="next-actions">
                <div className="section-title">Acoes disponiveis</div>
                <Link href={`/dashboard?companyId=${selected.company.id}`}>Abrir dashboard</Link>
              </div>
            </aside>
          ) : null}
        </section>
      )}
    </AppShell>
  );
}
