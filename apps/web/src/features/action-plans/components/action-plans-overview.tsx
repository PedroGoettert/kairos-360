import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ActionPlanCharts } from "@/features/action-plans/components/action-plan-charts";
import { organizationDashboardFixture as snapshot } from "@/features/dashboard/data/organization-dashboard-fixture";
import type { PlanStatus } from "@/features/dashboard/types/organization-dashboard-types";

const statusLabels: Record<PlanStatus, string> = { completed: "Concluído", in_progress: "Em andamento", not_started: "Não iniciado" };

export function ActionPlansOverview() {
  return (
    <AppShell activeNav="Planos" eyebrow="Execução das prioridades" title="Planos de ação">
      <section className="page-intro"><div><span className="data-label">Responsáveis e prazos</span><h2>Transforme gargalos em trabalho acompanhado</h2></div><p>Planos vinculados às áreas críticas, com progresso e prazo visíveis para a liderança.</p></section>
      <ActionPlanCharts plans={snapshot.actionPlans} />
      <section className="dashboard-section" aria-labelledby="plans-page-title">
        <div className="dashboard-section-heading"><div><h2 id="plans-page-title">Todos os planos</h2></div><span>{snapshot.actionPlans.length} registrados</span></div>
        <div className="dashboard-plan-list">
          {snapshot.actionPlans.map((plan) => (
            <Link className="dashboard-plan-row" href={`/dashboard/gargalos/${plan.areaSlug}#plano-de-acao`} key={plan.id}>
              <div><strong>{plan.title}</strong><span>{plan.responsible} · {plan.dueDate}</span></div>
              <div className="plan-progress-copy"><small>{statusLabels[plan.status]}</small><strong>{plan.progress}%</strong></div>
              <progress max="100" value={plan.progress} aria-label={`Progresso de ${plan.title}`} />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
