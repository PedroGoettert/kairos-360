import { AppShell } from "@/components/app-shell";
import { organizationDashboardFixture as snapshot } from "@/features/dashboard/data/organization-dashboard-fixture";

export function OrganizationSettings() {
  return (
    <AppShell activeNav="Configurações" eyebrow="Administração" title="Configurações">
      <section className="page-intro"><div><span className="data-label">Organização atual</span><h2>Dados e preferências da conta</h2></div><p>Configurações essenciais do tenant, sem transformar a operação em um builder genérico.</p></section>
      <section className="settings-layout">
        <nav aria-label="Seções de configuração"><a className="active" href="#organization">Organização</a><a href="#monitoring">Monitoramento</a><a href="#members">Membros</a></nav>
        <div className="settings-content" id="organization">
          <div className="dashboard-section-heading"><div><h2>Organização</h2></div></div>
          <dl><div><dt>Razão social</dt><dd>{snapshot.organization.name}</dd></div><div><dt>Nome de exibição</dt><dd>{snapshot.organization.tradeName}</dd></div><div><dt>Segmento</dt><dd>{snapshot.organization.industry}</dd></div><div><dt>Atualização</dt><dd>A cada {snapshot.connection.refreshIntervalSeconds} segundos</dd></div></dl>
        </div>
      </section>
    </AppShell>
  );
}
