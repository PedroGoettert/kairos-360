"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardActionPlan, PlanStatus } from "@/features/dashboard/types/organization-dashboard-types";

type ActionPlanChartsProps = { plans: DashboardActionPlan[] };
const statusLabels: Record<PlanStatus, string> = { completed: "Concluídos", in_progress: "Em andamento", not_started: "Não iniciados" };
const statusColors: Record<PlanStatus, string> = { completed: "#22c870", in_progress: "#f5c518", not_started: "#66635d" };
const tooltipStyle = { background: "#1a1918", border: "1px solid #363430", borderRadius: 6, color: "#fafaf8", fontSize: 12 };

export function ActionPlanCharts({ plans }: ActionPlanChartsProps) {
  const distribution = (Object.keys(statusLabels) as PlanStatus[]).map((status) => ({ name: statusLabels[status], status, value: plans.filter((plan) => plan.status === status).length })).filter((item) => item.value > 0);
  const progress = plans.map((plan) => ({ name: plan.title.replace("Reestruturar ", "").replace("Revisar ", "").replace("Ajustar ", ""), progress: plan.progress, status: plan.status }));

  return (
    <section className="metrics-chart-grid" aria-label="Gráficos dos planos de ação">
      <article className="dashboard-chart-panel">
        <div className="chart-heading"><div><span className="data-label">Carteira de execução</span><h2>Distribuição por status</h2></div><strong>{plans.length}</strong></div>
        <div className="plan-donut-layout">
          <div className="chart-canvas chart-canvas-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer><Pie data={distribution} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={3}>{distribution.map((item) => <Cell fill={statusColors[item.status]} key={item.status} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Planos"]} /></PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="chart-legend-list">{distribution.map((item) => <li key={item.status}><span style={{ background: statusColors[item.status] }} /><div><strong>{item.value}</strong><small>{item.name}</small></div></li>)}</ul>
        </div>
      </article>
      <article className="dashboard-chart-panel">
        <div className="chart-heading"><div><span className="data-label">Andamento</span><h2>Progresso comparativo</h2></div><span>0–100%</span></div>
        <div className="chart-canvas chart-canvas-plans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={progress} layout="vertical" margin={{ left: 8, right: 14, top: 5, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#242320" strokeDasharray="3 3" />
              <XAxis axisLine={false} domain={[0, 100]} tick={{ fill: "#9b9b94", fontSize: 10 }} tickFormatter={(value) => `${value}%`} tickLine={false} type="number" />
              <YAxis axisLine={false} dataKey="name" tick={{ fill: "#c7c7be", fontSize: 10 }} tickLine={false} type="category" width={110} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#22211f" }} formatter={(value) => [`${value}%`, "Progresso"]} />
              <Bar dataKey="progress" radius={[0, 3, 3, 0]}>{progress.map((item) => <Cell fill={statusColors[item.status]} key={item.name} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
