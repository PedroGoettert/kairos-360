import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { BaselineAssessmentForm } from "@/features/baseline-diagnostics/components/baseline-assessment-form";
import type { BaselineAnswer, BaselineArea, BaselineDiagnostic, BaselineScores } from "@/features/baseline-diagnostics/types/baseline-types";

type Props = { diagnostic: BaselineDiagnostic; areas: BaselineArea[]; answers: BaselineAnswer[]; scores: BaselineScores | null };
export function BaselineAssessment({ diagnostic, areas, answers, scores }: Props) {
  return <AppShell activeNav="Baseline" eyebrow="Aplicação do diagnóstico" title={diagnostic.title ?? "Baseline"}>
    <nav className="breadcrumb" aria-label="Navegação estrutural"><Link href="/baseline">Baseline</Link><span>/</span><strong>{diagnostic.status === "completed" ? "Resultado" : "Avaliação"}</strong></nav>
    {diagnostic.status === "draft" ? <BaselineAssessmentForm diagnostic={diagnostic} areas={areas} initialAnswers={answers} /> : scores ? <><section className="baseline-summary"><div><span>Status</span><strong>Concluído</strong><small>{diagnostic.completedAt ? new Date(diagnostic.completedAt).toLocaleDateString("pt-BR") : ""}</small></div><div><span>Score geral</span><strong>{scores.generalScore.toFixed(1)}</strong><small>{scores.healthClassification}</small></div><div><span>Principal gargalo</span><strong>{scores.mainBottleneck.areaName}</strong><small>Score {scores.mainBottleneck.score.toFixed(1)}</small></div></section><section className="dashboard-section"><div className="dashboard-section-heading"><div><h2>Scores por área</h2></div></div><div className="baseline-area-list">{scores.scores.map((area) => <div key={area.areaId}><span>{area.areaName}</span><strong>{area.score.toFixed(1)}</strong></div>)}</div></section></> : <section className="module-empty-state"><h2>Scores indisponíveis</h2><p>A aplicação está concluída, mas a API não retornou os scores.</p></section>}
  </AppShell>;
}
