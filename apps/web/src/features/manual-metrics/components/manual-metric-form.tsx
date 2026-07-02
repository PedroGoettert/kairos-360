"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  manualMetricFormSchema,
  type ManualMetricFormInput,
  type ManualMetricFormOutput,
} from "@/features/manual-metrics/schemas/manual-metric-schema";
import {
  manualMetricCategories,
  manualMetricCategoryLabels,
  type ManualMetric,
} from "@/features/manual-metrics/types/manual-metrics-types";

type ManualMetricFormProps = {
  metric: ManualMetric | null;
  onCancelEdit: () => void;
  onSubmit: (input: ManualMetricFormOutput) => Promise<void>;
};

function getDefaultValues(metric: ManualMetric | null): ManualMetricFormInput {
  if (!metric) {
    return {
      category: "finance",
      metricKey: "",
      metricLabel: "",
      value: 0,
      unit: "",
      referenceDate: new Date().toISOString().slice(0, 10),
      notes: "",
    };
  }

  return {
    category: metric.category,
    metricKey: metric.metricKey,
    metricLabel: metric.metricLabel,
    value: metric.value,
    unit: metric.unit ?? "",
    referenceDate: metric.referenceDate.slice(0, 10),
    notes: metric.notes ?? "",
  };
}

export function ManualMetricForm({
  metric,
  onCancelEdit,
  onSubmit,
}: ManualMetricFormProps) {
  const form = useForm<ManualMetricFormInput, unknown, ManualMetricFormOutput>({
    defaultValues: getDefaultValues(metric),
    resolver: zodResolver(manualMetricFormSchema),
  });

  useEffect(() => {
    form.reset(getDefaultValues(metric));
  }, [form, metric]);

  return (
    <form className="manual-metric-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="form-grid">
        <label className="form-field required">
          <span>Categoria</span>
          <select {...form.register("category")}>
            {manualMetricCategories.map((category) => (
              <option key={category} value={category}>
                {manualMetricCategoryLabels[category]}
              </option>
            ))}
          </select>
          {form.formState.errors.category?.message ? (
            <small>{form.formState.errors.category.message}</small>
          ) : null}
        </label>

        <label className="form-field required">
          <span>Data de referencia</span>
          <input type="date" {...form.register("referenceDate")} />
          {form.formState.errors.referenceDate?.message ? (
            <small>{form.formState.errors.referenceDate.message}</small>
          ) : null}
        </label>

        <label className="form-field required form-field-wide">
          <span>Nome da metrica</span>
          <input
            placeholder="Ex.: Receita mensal"
            {...form.register("metricLabel")}
          />
          {form.formState.errors.metricLabel?.message ? (
            <small>{form.formState.errors.metricLabel.message}</small>
          ) : null}
        </label>

        <label className="form-field required">
          <span>Chave da metrica</span>
          <input
            placeholder="receita_mensal"
            {...form.register("metricKey")}
          />
          {form.formState.errors.metricKey?.message ? (
            <small>{form.formState.errors.metricKey.message}</small>
          ) : null}
        </label>

        <label className="form-field required">
          <span>Valor</span>
          <input
            inputMode="decimal"
            step="any"
            type="number"
            {...form.register("value")}
          />
          {form.formState.errors.value?.message ? (
            <small>{form.formState.errors.value.message}</small>
          ) : null}
        </label>

        <label className="form-field">
          <span>Unidade</span>
          <input placeholder="BRL, %, tickets" {...form.register("unit")} />
        </label>

        <label className="form-field form-field-wide">
          <span>Observacoes</span>
          <textarea rows={4} {...form.register("notes")} />
        </label>
      </div>

      <div className="form-actions">
        {metric ? (
          <button
            className="ghost-action"
            onClick={() => {
              form.reset(getDefaultValues(null));
              onCancelEdit();
            }}
            type="button"
          >
            Cancelar edicao
          </button>
        ) : null}
        <button
          className="primary-action"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting
            ? metric
              ? "Salvando..."
              : "Cadastrando..."
            : metric
              ? "Salvar metrica"
              : "Cadastrar metrica"}
        </button>
      </div>
    </form>
  );
}
