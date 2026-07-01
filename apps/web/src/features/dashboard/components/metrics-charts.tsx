"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Bottleneck } from "@/features/dashboard/types/organization-dashboard-types";

type MetricsChartsProps = { bottlenecks: Bottleneck[] };

const funnelData = [
  { stage: "Leads", value: 184 },
  { stage: "Qualificados", value: 57 },
  { stage: "Oportunidades", value: 31 },
  { stage: "Vendas", value: 12 },
];

const tooltipStyle = { background: "#1a1918", border: "1px solid #363430", borderRadius: 6, color: "#fafaf8", fontSize: 12 };
const lineColors = ["#ef4444", "#f5c518", "#ff6b2b"];

export function MetricsCharts({ bottlenecks }: MetricsChartsProps) {
  const priorityAreas = bottlenecks.slice(0, 3);
  const history = priorityAreas[0]?.history.map((point, index) => ({
    label: point.label,
    ...Object.fromEntries(priorityAreas.map((area) => [area.areaName, area.history[index]?.score ?? 0])),
  })) ?? [];

  return (
    <section className="metrics-chart-grid" aria-label="Gráficos operacionais">
      <article className="dashboard-chart-panel">
        <div className="chart-heading"><div><span className="data-label">Comercial</span><h2>Funil do período</h2></div><span>30 dias</span></div>
        <p className="sr-only">De 184 leads, 57 foram qualificados, 31 viraram oportunidades e 12 vendas.</p>
        <div className="chart-canvas chart-canvas-funnel">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={funnelData} margin={{ left: -14, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="#242320" strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey="stage" tick={{ fill: "#c7c7be", fontSize: 10 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: "#9b9b94", fontSize: 10 }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#22211f" }} formatter={(value) => [value, "Volume"]} />
              <Bar dataKey="value" fill="#ff6b2b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="dashboard-chart-panel">
        <div className="chart-heading"><div><span className="data-label">Áreas prioritárias</span><h2>Evolução comparada</h2></div><span>6 meses</span></div>
        <p className="sr-only">Comparação histórica entre Comercial, Financeiro e Marketing.</p>
        <div className="chart-canvas chart-canvas-funnel">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart accessibilityLayer data={history} margin={{ left: -20, right: 10, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="#242320" strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: "#9b9b94", fontSize: 11 }} tickLine={false} />
              <YAxis axisLine={false} domain={[0, 10]} tick={{ fill: "#9b9b94", fontSize: 11 }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="line" wrapperStyle={{ color: "#c7c7be", fontSize: 11 }} />
              {priorityAreas.map((area, index) => <Line dataKey={area.areaName} dot={false} key={area.slug} stroke={lineColors[index]} strokeWidth={2.2} type="monotone" />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
