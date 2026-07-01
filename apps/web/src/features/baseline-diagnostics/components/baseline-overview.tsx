import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { NewBaselineForm } from "@/features/baseline-diagnostics/components/new-baseline-form";
import type { BaselineArea, BaselineDiagnostic, BaselineScores } from "@/features/baseline-diagnostics/types/baseline-types";

type Props = { areas: BaselineArea[]; diagnostics: BaselineDiagnostic[]; latestScores: BaselineScores | null };
const healthLabels = { critical: "Crítico", attention: "Atenção", healthy: "Saudável" } as const;

export function BaselineOverview({ areas, diagnostics, latestScores }: Props) {
  const latest = diagnostics[0] ?? null;
  return <AppShell activeNav="Baseline" eyebrow="Diagnóstico inicial" title="Baseline">
    <section className="page-intro"><div><span className="data-label">Referência organizacional</span><h2>O ponto de partida da saúde da empresa</h2></div><p>O baseline registra a leitura manual inicial e serve de referência para a evolução das áreas.</p></section>
    {areas.length === 0 ? <section className="module-empty-state"><span className="data-label">Configuração necessária</span><h2>O baseline ainda não possui áreas</h2><p>Aplique um template ou configure as áreas da organização pela API antes de iniciar a avaliação.</p></section> : null}
    {areas.length > 0 && !latest ? <section className="module-empty-state"><span className="data-label">Primeira aplicação</span><h2>Estabeleça a baseline da organização</h2><p>{areas.length} áreas e {areas.reduce((total, area) => total + area.questions.length, 0)} perguntas estão prontas para avaliação.</p><NewBaselineForm /></section> : null}
    {latest ? <>
      <section className="baseline-summary"><div><span>Status</span><strong>{latest.status === "completed" ? "Concluído" : "Rascunho"}</strong><small>{latest.completedAt ? `Concluído em ${new Date(latest.completedAt).toLocaleDateString("pt-BR")}` : "Aplicação em andamento"}</small></div><div><span>Score geral</span><strong>{latestScores ? latestScores.generalScore.toFixed(1) : "--"}</strong><small>{latestScores ? healthLabels[latestScores.healthClassification] : "Aguardando conclusão"}</small></div><div><span>Aplicações</span><strong>{diagnostics.length}</strong><small>Histórico da organização</small></div></section>
      {latest.status === "draft" ? <section className="baseline-resume"><div><strong>{latest.title ?? "Baseline em andamento"}</strong><span>Continue de onde parou para calcular os scores.</span></div><Link className="primary-action" href={`/baseline/${latest.id}`}>Continuar avaliação</Link></section> : <div className="baseline-new-cycle"><NewBaselineForm /></div>}
      {latestScores ? <section className="dashboard-section" aria-labelledby="baseline-areas-title"><div className="dashboard-section-heading"><div><h2 id="baseline-areas-title">Resultado por área</h2></div><span>{latestScores.scores.length} áreas</span></div><div className="baseline-area-list">{[...latestScores.scores].sort((a, b) => a.score - b.score).map((area) => <div key={area.areaId}><span><span className={`status-dot is-${area.score < 5 ? "critical" : area.score < 7.5 ? "attention" : "healthy"}`} />{area.areaName}</span><strong>{area.score.toFixed(1)}</strong></div>)}</div></section> : null}
      <section className="dashboard-section"><div className="dashboard-section-heading"><div><h2>Histórico de aplicações</h2></div></div><div className="baseline-history">{diagnostics.map((diagnostic) => <Link href={`/baseline/${diagnostic.id}`} key={diagnostic.id}><div><strong>{diagnostic.title ?? "Baseline sem título"}</strong><span>{new Date(diagnostic.createdAt).toLocaleDateString("pt-BR")}</span></div><span className={`diagnostic-status ${diagnostic.status}`}>{diagnostic.status === "completed" ? "Concluído" : "Rascunho"}</span></Link>)}</div></section>
    </> : null}
  </AppShell>;
}
