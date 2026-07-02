"use client";

import { useMemo, useState } from "react";

import { MetricsCharts } from "@/features/dashboard/components/metrics-charts";
import { ManualMetricForm } from "@/features/manual-metrics/components/manual-metric-form";
import {
  createManualMetric,
  deleteManualMetric,
  updateManualMetric,
} from "@/features/manual-metrics/services/manual-metrics-service";
import type { ManualMetricFormOutput } from "@/features/manual-metrics/schemas/manual-metric-schema";
import {
  manualMetricCategoryLabels,
  type ManualMetric,
} from "@/features/manual-metrics/types/manual-metrics-types";

type ManualMetricsWorkflowProps = {
  initialMetrics: ManualMetric[];
};

type FeedbackState = {
  type: "error" | "success";
  message: string;
} | null;

function sortMetrics(metrics: ManualMetric[]) {
  return [...metrics].sort((left, right) => {
    const referenceOrder =
      new Date(right.referenceDate).getTime() - new Date(left.referenceDate).getTime();

    if (referenceOrder !== 0) {
      return referenceOrder;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function formatMetricValue(metric: ManualMetric) {
  const formatter = Number.isInteger(metric.value)
    ? new Intl.NumberFormat("pt-BR")
    : new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });

  return metric.unit ? `${formatter.format(metric.value)} ${metric.unit}` : formatter.format(metric.value);
}

function formatReferenceDate(referenceDate: string) {
  return new Date(referenceDate).toLocaleDateString("pt-BR");
}

export function ManualMetricsWorkflow({
  initialMetrics,
}: ManualMetricsWorkflowProps) {
  const [metrics, setMetrics] = useState(() => sortMetrics(initialMetrics));
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [editingMetric, setEditingMetric] = useState<ManualMetric | null>(null);
  const [deletingMetricId, setDeletingMetricId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const lastReferenceDate = metrics[0]?.referenceDate ?? null;
    const activeCategories = new Set(metrics.map((metric) => metric.category)).size;
    const latestMetrics = metrics.slice(0, 4);

    return {
      activeCategories,
      lastReferenceDate,
      latestMetrics,
      total: metrics.length,
    };
  }, [metrics]);

  async function handleSubmit(input: ManualMetricFormOutput) {
    setFeedback(null);

    try {
      if (editingMetric) {
        const updatedMetric = await updateManualMetric(editingMetric.id, input);
        setMetrics((currentMetrics) =>
          sortMetrics(
            currentMetrics.map((metric) =>
              metric.id === updatedMetric.id ? updatedMetric : metric,
            ),
          ),
        );
        setEditingMetric(null);
        setFeedback({ type: "success", message: "Metrica atualizada." });
        return;
      }

      const createdMetric = await createManualMetric(input);
      setMetrics((currentMetrics) => sortMetrics([createdMetric, ...currentMetrics]));
      setFeedback({ type: "success", message: "Metrica cadastrada." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel salvar a metrica.",
      });
    }
  }

  async function handleDelete(metric: ManualMetric) {
    const confirmed = window.confirm(
      `Remover a metrica "${metric.metricLabel}" da organizacao atual?`,
    );

    if (!confirmed) {
      return;
    }

    setFeedback(null);
    setDeletingMetricId(metric.id);

    try {
      await deleteManualMetric(metric.id);
      setMetrics((currentMetrics) =>
        currentMetrics.filter((currentMetric) => currentMetric.id !== metric.id),
      );
      if (editingMetric?.id === metric.id) {
        setEditingMetric(null);
      }
      setFeedback({ type: "success", message: "Metrica removida." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel remover a metrica.",
      });
    } finally {
      setDeletingMetricId(null);
    }
  }

  return (
    <>
      {feedback ? (
        <div
          className={`form-alert ${feedback.type}`}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="manual-metrics-layout">
        <article className="dashboard-chart-panel">
          <div className="chart-heading">
            <div>
              <span className="data-label">
                {editingMetric ? "Edicao" : "Nova entrada"}
              </span>
              <h2>
                {editingMetric ? "Atualizar metrica manual" : "Cadastrar metrica manual"}
              </h2>
            </div>
          </div>
          <p className="manual-metrics-copy">
            Registre indicadores operacionais da organizacao atual enquanto as
            integracoes ainda nao alimentam esses dados automaticamente.
          </p>
          <ManualMetricForm
            metric={editingMetric}
            onCancelEdit={() => setEditingMetric(null)}
            onSubmit={handleSubmit}
          />
        </article>

        <aside className="dashboard-chart-panel manual-metrics-aside">
          <div className="chart-heading">
            <div>
              <span className="data-label">Cobertura atual</span>
              <h2>Resumo da coleta manual</h2>
            </div>
          </div>
          <div className="manual-metrics-summary-grid">
            <article>
              <span>Total de metricas</span>
              <strong>{summary.total}</strong>
            </article>
            <article>
              <span>Categorias ativas</span>
              <strong>{summary.activeCategories}</strong>
            </article>
            <article>
              <span>Ultima referencia</span>
              <strong>
                {summary.lastReferenceDate
                  ? formatReferenceDate(summary.lastReferenceDate)
                  : "--"}
              </strong>
            </article>
          </div>
          <div className="manual-metrics-aside-copy">
            <strong>Campos esperados</strong>
            <p>
              Categoria, nome, chave, valor, unidade, data de referencia e
              observacoes ficam vinculados a organizacao atual.
            </p>
          </div>
        </aside>
      </section>

      {metrics.length === 0 ? (
        <section className="module-empty-state">
          <span className="data-label">Metricas manuais</span>
          <h2>Nenhuma metrica foi cadastrada</h2>
          <p>
            Use o formulario acima para registrar os primeiros indicadores da
            operacao e alimentar o dashboard organizacional.
          </p>
        </section>
      ) : (
        <>
          <section className="dashboard-section" aria-labelledby="headline-metrics-title">
            <div className="dashboard-section-heading">
              <div>
                <h2 id="headline-metrics-title">Indicadores mais recentes</h2>
              </div>
              <span>{summary.total} metricas registradas</span>
            </div>
            <div className="metric-strip">
              {summary.latestMetrics.map((metric) => (
                <article className="metric-summary" key={metric.id}>
                  <span>{metric.metricLabel}</span>
                  <strong>{formatMetricValue(metric)}</strong>
                  <div>
                    <span className="trend-copy stable">
                      {manualMetricCategoryLabels[metric.category]}
                    </span>
                    <small>{formatReferenceDate(metric.referenceDate)}</small>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <MetricsCharts manualMetrics={metrics} />

          <section className="dashboard-section" aria-labelledby="metrics-registry-title">
            <div className="dashboard-section-heading">
              <div>
                <h2 id="metrics-registry-title">Registro completo</h2>
              </div>
              <span>Ordenado por data de referencia</span>
            </div>
            <div className="manual-metrics-list">
              {metrics.map((metric) => (
                <article className="manual-metrics-row" key={metric.id}>
                  <div className="manual-metrics-main">
                    <strong>{metric.metricLabel}</strong>
                    <span>
                      {manualMetricCategoryLabels[metric.category]} - chave{" "}
                      {metric.metricKey}
                    </span>
                    {metric.notes ? <p>{metric.notes}</p> : null}
                  </div>
                  <div className="manual-metrics-meta">
                    <span>Valor</span>
                    <strong>{formatMetricValue(metric)}</strong>
                  </div>
                  <div className="manual-metrics-meta">
                    <span>Referencia</span>
                    <strong>{formatReferenceDate(metric.referenceDate)}</strong>
                  </div>
                  <div className="manual-metrics-actions">
                    <button
                      className="ghost-action"
                      onClick={() => setEditingMetric(metric)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="ghost-action"
                      disabled={deletingMetricId === metric.id}
                      onClick={() => void handleDelete(metric)}
                      type="button"
                    >
                      {deletingMetricId === metric.id ? "Removendo..." : "Remover"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
