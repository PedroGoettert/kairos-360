"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Bottleneck, HealthStatus } from "@/features/dashboard/types/organization-dashboard-types";

type DashboardChartsProps = {
  bottlenecks: Bottleneck[];
};

const statusColors: Record<HealthStatus, string> = {
  attention: "#f5c518",
  critical: "#ef4444",
  healthy: "#22c870",
};

const tooltipStyle = {
  background: "#1a1918",
  border: "1px solid #363430",
  borderRadius: 6,
  color: "#fafaf8",
  fontSize: 12,
};

export function DashboardCharts({ bottlenecks }: DashboardChartsProps) {
  const history = bottlenecks[0]?.history.map((point, index) => {
    const scores = bottlenecks.map((area) => area.history[index]?.score).filter((score): score is number => score !== undefined);
    const average = scores.reduce((total, score) => total + score, 0) / scores.length;
    return { label: point.label, score: Number(average.toFixed(1)) };
  }) ?? [];

  const areaScores = bottlenecks.map((area) => ({ area: area.areaName, score: area.score, status: area.status }));

  return (
    <section className="dashboard-chart-grid" aria-label="Visão gráfica da saúde organizacional">
      <article className="dashboard-chart-panel">
        <div className="chart-heading">
          <div><span className="data-label">Evolução consolidada</span><h2>Saúde geral</h2></div>
          <strong>{history.at(-1)?.score.toFixed(1)}</strong>
        </div>
        <p className="sr-only">A saúde média evoluiu de {history[0]?.score.toFixed(1)} em {history[0]?.label} para {history.at(-1)?.score.toFixed(1)} em {history.at(-1)?.label}.</p>
        <div className="chart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart accessibilityLayer data={history} margin={{ left: -20, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid stroke="#242320" strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: "#9b9b94", fontSize: 11 }} tickLine={false} />
              <YAxis axisLine={false} domain={[0, 10]} tick={{ fill: "#9b9b94", fontSize: 11 }} tickLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#55514b" }} formatter={(value) => [Number(value).toFixed(1), "Score"]} />
              <Line activeDot={{ fill: "#ff6b2b", r: 5 }} dataKey="score" dot={{ fill: "#08080a", r: 3, stroke: "#ff6b2b", strokeWidth: 2 }} stroke="#ff6b2b" strokeWidth={2.5} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="dashboard-chart-panel">
        <div className="chart-heading"><div><span className="data-label">Comparação atual</span><h2>Score por área</h2></div><span>0–10</span></div>
        <p className="sr-only">Comercial possui o menor score, com {areaScores[0]?.score.toFixed(1)}. Atendimento possui o maior, com {areaScores.at(-1)?.score.toFixed(1)}.</p>
        <div className="chart-canvas chart-canvas-bars">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={areaScores} layout="vertical" margin={{ left: 8, right: 14, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#242320" strokeDasharray="3 3" />
              <XAxis axisLine={false} domain={[0, 10]} tick={{ fill: "#9b9b94", fontSize: 11 }} tickLine={false} type="number" />
              <YAxis axisLine={false} dataKey="area" tick={{ fill: "#c7c7be", fontSize: 11 }} tickLine={false} type="category" width={78} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#22211f" }} formatter={(value) => [Number(value).toFixed(1), "Score"]} />
              <Bar dataKey="score" radius={[0, 3, 3, 0]}>
                {areaScores.map((entry) => <Cell fill={statusColors[entry.status]} key={entry.area} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
