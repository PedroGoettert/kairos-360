"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  manualMetricCategoryLabels,
  manualMetricCategories,
  type ManualMetric,
} from "@/features/manual-metrics/types/manual-metrics-types";

type MetricsChartsProps = {
  manualMetrics: ManualMetric[];
};

const tooltipStyle = {
  background: "#1a1918",
  border: "1px solid #363430",
  borderRadius: 6,
  color: "#fafaf8",
  fontSize: 12,
};

function formatDayLabel(referenceDate: string) {
  return new Date(referenceDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function MetricsCharts({ manualMetrics }: MetricsChartsProps) {
  const categoryData = manualMetricCategories
    .map((category) => ({
      category: manualMetricCategoryLabels[category],
      total: manualMetrics.filter((metric) => metric.category === category).length,
    }))
    .filter((entry) => entry.total > 0);

  const referenceTimeline = Object.entries(
    manualMetrics.reduce<Record<string, number>>((accumulator, metric) => {
      const key = metric.referenceDate.slice(0, 10);
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-8)
    .map(([referenceDate, total]) => ({
      label: formatDayLabel(referenceDate),
      total,
    }));

  return (
    <section className="metrics-chart-grid" aria-label="Graficos das metricas manuais">
      <article className="dashboard-chart-panel">
        <div className="chart-heading">
          <div>
            <span className="data-label">Distribuicao</span>
            <h2>Metricas por categoria</h2>
          </div>
          <span>Organizacao atual</span>
        </div>
        <div className="chart-canvas chart-canvas-funnel">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={categoryData}
              margin={{ left: -18, right: 8, top: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#242320" strokeDasharray="3 3" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="category"
                tick={{ fill: "#c7c7be", fontSize: 10 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tick={{ fill: "#9b9b94", fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "#22211f" }}
                formatter={(value) => [value, "Metricas"]}
              />
              <Bar dataKey="total" fill="#ff6b2b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="dashboard-chart-panel">
        <div className="chart-heading">
          <div>
            <span className="data-label">Cadencia</span>
            <h2>Entradas recentes</h2>
          </div>
          <span>Ultimas referencias</span>
        </div>
        <div className="chart-canvas chart-canvas-funnel">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={referenceTimeline}
              margin={{ left: -20, right: 10, top: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#242320" strokeDasharray="3 3" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: "#9b9b94", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tick={{ fill: "#9b9b94", fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [value, "Registros"]}
              />
              <Line
                activeDot={{ fill: "#ff6b2b", r: 5 }}
                dataKey="total"
                dot={{ fill: "#08080a", r: 3, stroke: "#ff6b2b", strokeWidth: 2 }}
                stroke="#ff6b2b"
                strokeWidth={2.5}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
