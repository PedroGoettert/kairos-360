"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  actionPlanDraftSchema,
  type ActionPlanDraftInput,
} from "@/features/action-plans/schemas/action-plan-draft-schema";

type ActionPlanDraftFormProps = {
  areaName: string;
  recommendation: string;
};

export function ActionPlanDraftForm({
  areaName,
  recommendation,
}: ActionPlanDraftFormProps) {
  const [preparedPlan, setPreparedPlan] = useState<ActionPlanDraftInput | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ActionPlanDraftInput>({
    defaultValues: {
      dueDate: "2026-07-15",
      objective: recommendation,
      responsible: "",
      title: `Plano de recuperação: ${areaName}`,
    },
    resolver: zodResolver(actionPlanDraftSchema),
  });

  function onSubmit(input: ActionPlanDraftInput) {
    setPreparedPlan(input);
  }

  return (
    <form className="action-plan-draft" onSubmit={handleSubmit(onSubmit)}>
      <div className="draft-form-grid">
        <label className="form-field required form-field-wide">
          <span>Título</span>
          <input
            aria-describedby={errors.title ? "plan-title-error" : undefined}
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
          {errors.title?.message ? <small id="plan-title-error">{errors.title.message}</small> : null}
        </label>

        <label className="form-field required form-field-wide">
          <span>Objetivo</span>
          <textarea
            aria-describedby={errors.objective ? "plan-objective-error" : undefined}
            aria-invalid={Boolean(errors.objective)}
            rows={4}
            {...register("objective")}
          />
          {errors.objective?.message ? <small id="plan-objective-error">{errors.objective.message}</small> : null}
        </label>

        <label className="form-field required">
          <span>Responsável</span>
          <input
            aria-describedby={errors.responsible ? "plan-responsible-error" : undefined}
            aria-invalid={Boolean(errors.responsible)}
            placeholder="Nome do responsável"
            {...register("responsible")}
          />
          {errors.responsible?.message ? <small id="plan-responsible-error">{errors.responsible.message}</small> : null}
        </label>

        <label className="form-field required">
          <span>Prazo</span>
          <input
            aria-describedby={errors.dueDate ? "plan-date-error" : undefined}
            aria-invalid={Boolean(errors.dueDate)}
            type="date"
            {...register("dueDate")}
          />
          {errors.dueDate?.message ? <small id="plan-date-error">{errors.dueDate.message}</small> : null}
        </label>
      </div>

      {preparedPlan ? (
        <div className="form-alert success" role="status">
          Plano preparado para revisão: {preparedPlan.title}.
        </div>
      ) : null}

      <div className="form-actions">
        <button className="primary-action" type="submit">
          Preparar plano
        </button>
      </div>
    </form>
  );
}
