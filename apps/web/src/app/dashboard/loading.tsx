export default function DashboardLoading() {
  return (
    <main className="workspace loading-workspace" aria-busy="true" aria-label="Carregando dashboard">
      <div className="loading-block loading-title" />
      <div className="loading-block loading-hero" />
      <div className="kpi-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="loading-block loading-kpi" key={index} />
        ))}
      </div>
      <div className="loading-block loading-content" />
    </main>
  );
}
