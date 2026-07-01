import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { organizationDashboardFixture as snapshot } from "@/features/dashboard/data/organization-dashboard-fixture";

export function BaselineOverview() {
  return (
    <AppShell activeNav="Baseline" eyebrow="Diagnóstico inicial" title="Baseline">
      <section className="page-intro"><div><span className="data-label">Referência organizacional</span><h2>O ponto de partida da saúde da empresa</h2></div><p>O baseline registra a leitura manual inicial e serve de referência para a evolução das áreas.</p></section>
      <section className="baseline-summary">
        <div><span>Status</span><strong>Concluído</strong><small>Última aplicação em 18 jun 2026</small></div>
        <div><span>Score geral</span><strong>{snapshot.health.score.toFixed(1)}</strong><small>7 áreas avaliadas</small></div>
        <div><span>Próxima revisão</span><strong>18 set</strong><small>Ciclo trimestral</small></div>
      </section>
      <section className="dashboard-section" aria-labelledby="baseline-areas-title">
        <div className="dashboard-section-heading"><div><h2 id="baseline-areas-title">Resultado por área</h2></div><span>{snapshot.bottlenecks.length} áreas</span></div>
        <div className="baseline-area-list">
          {snapshot.bottlenecks.map((area) => <Link href={`/dashboard/gargalos/${area.slug}`} key={area.slug}><span><span className={`status-dot is-${area.status}`} />{area.areaName}</span><strong>{area.score.toFixed(1)}</strong></Link>)}
        </div>
      </section>
    </AppShell>
  );
}
