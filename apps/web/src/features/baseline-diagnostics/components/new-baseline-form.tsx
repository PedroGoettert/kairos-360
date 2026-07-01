"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { newBaselineSchema, type NewBaselineInput, type NewBaselineOutput } from "@/features/baseline-diagnostics/schemas/baseline-schema";
import { createBaseline } from "@/features/baseline-diagnostics/services/baseline-service";

export function NewBaselineForm() {
  const router = useRouter(); const [error, setError] = useState<string | null>(null);
  const form = useForm<NewBaselineInput, unknown, NewBaselineOutput>({ resolver: zodResolver(newBaselineSchema), defaultValues: { title: "" } });
  async function submit(input: NewBaselineOutput) { setError(null); try { const diagnostic = await createBaseline(input.title); router.push(`/baseline/${diagnostic.id}`); } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível iniciar o baseline."); } }
  return <form className="baseline-start-form" onSubmit={form.handleSubmit(submit)}><label className="form-field"><span>Título da aplicação</span><input placeholder="Ex: Baseline inicial - julho de 2026" {...form.register("title")} /></label>{error ? <div className="form-alert error" role="alert">{error}</div> : null}<button className="primary-action" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? "Iniciando..." : "Iniciar baseline"}</button></form>;
}
