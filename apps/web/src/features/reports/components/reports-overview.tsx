import { AppShell } from "@/components/app-shell";

const reports = [
  { title: "Revisão executiva mensal", period: "Junho 2026", status: "Disponível" },
  { title: "Evolução da saúde organizacional", period: "2º trimestre de 2026", status: "Disponível" },
  { title: "Acompanhamento de planos", period: "Julho 2026", status: "Em preparação" },
];

export function ReportsOverview() {
  return (
    <AppShell activeNav="Relatórios" eyebrow="Síntese para decisão" title="Relatórios">
      <section className="page-intro"><div><span className="data-label">Histórico consolidado</span><h2>Leituras prontas para os rituais de gestão</h2></div><p>Consolidações periódicas da saúde, dos gargalos e da execução dos planos da organização.</p></section>
      <section className="dashboard-section" aria-labelledby="reports-title">
        <div className="dashboard-section-heading"><div><h2 id="reports-title">Relatórios recentes</h2></div><span>{reports.length} registros</span></div>
        <div className="report-list">{reports.map((report) => <article key={report.title}><div><strong>{report.title}</strong><span>{report.period}</span></div><span className={report.status === "Disponível" ? "report-status available" : "report-status"}>{report.status}</span><button disabled={report.status !== "Disponível"} type="button">Abrir</button></article>)}</div>
      </section>
    </AppShell>
  );
}
