import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { organizationDashboardFixture as snapshot } from "@/features/dashboard/data/organization-dashboard-fixture";

export function SignalsOverview() {
  const signals = snapshot.bottlenecks.flatMap((area) => area.signals.map((signal) => ({ ...signal, area })));
  return (
    <AppShell activeNav="Sinais" eyebrow="Mudanças relevantes" title="Sinais">
      <section className="page-intro"><div><span className="data-label">Leitura priorizada</span><h2>Desvios que pedem atenção da liderança</h2></div><p>Sinais derivados das métricas e do baseline, ordenados por severidade e impacto.</p></section>
      <section className="dashboard-section" aria-labelledby="signals-page-title">
        <div className="dashboard-section-heading"><div><h2 id="signals-page-title">Sinais ativos</h2></div><span>{signals.length} detectados</span></div>
        <div className="signal-feed">
          {signals.map(({ area, ...signal }) => (
            <Link className="signal-feed-item signal-page-row" href={`/dashboard/gargalos/${area.slug}`} key={signal.id}>
              <span className={`signal-marker ${signal.severity}`} />
              <div><span className="signal-area">{area.areaName}</span><strong>{signal.title}</strong><p>{signal.description}</p><small>{signal.detectedAt}</small></div>
              <span className="row-action">Investigar</span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
