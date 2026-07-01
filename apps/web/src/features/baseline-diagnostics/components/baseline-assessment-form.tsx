"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { baselineAnswersSchema, type BaselineAnswersInput, type BaselineAnswersOutput } from "@/features/baseline-diagnostics/schemas/baseline-schema";
import { completeBaseline, createBaselineAnswer, updateBaselineAnswer } from "@/features/baseline-diagnostics/services/baseline-service";
import type { BaselineAnswer, BaselineArea, BaselineDiagnostic } from "@/features/baseline-diagnostics/types/baseline-types";

type Props = { diagnostic: BaselineDiagnostic; areas: BaselineArea[]; initialAnswers: BaselineAnswer[] };
export function BaselineAssessmentForm({ diagnostic, areas, initialAnswers }: Props) {
  const router = useRouter(); const [error, setError] = useState<string | null>(null);
  const questions = areas.flatMap((area) => area.questions.filter((question) => question.isActive));
  const answerByQuestion = new Map(initialAnswers.map((answer) => [answer.questionId, answer]));
  const form = useForm<BaselineAnswersInput, unknown, BaselineAnswersOutput>({ resolver: zodResolver(baselineAnswersSchema), defaultValues: { answers: Object.fromEntries(initialAnswers.map((answer) => [answer.questionId, answer.score])) } });
  async function submit(input: BaselineAnswersOutput) {
    setError(null);
    if (Object.keys(input.answers).length !== questions.length) { setError("Responda todas as perguntas antes de concluir."); return; }
    try {
      await Promise.all(questions.map((question) => { const existing = answerByQuestion.get(question.id); const score = input.answers[question.id]; return existing ? updateBaselineAnswer(existing.id, score) : createBaselineAnswer(diagnostic.id, question.id, score); }));
      await completeBaseline(diagnostic.id); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível concluir o baseline."); }
  }
  return <form className="baseline-assessment" onSubmit={form.handleSubmit(submit)}>{areas.filter((area) => area.isActive).map((area) => <section className="dashboard-section" key={area.id}><div className="dashboard-section-heading"><div><span className="data-label">Área avaliada</span><h2>{area.name}</h2></div><span>{area.questions.filter((question) => question.isActive).length} perguntas</span></div><div className="baseline-question-list">{area.questions.filter((question) => question.isActive).map((question, index) => <label className="baseline-question" key={question.id}><span><strong>{index + 1}. {question.question}</strong>{question.description ? <small>{question.description}</small> : null}</span><select required aria-label={`Nota para ${question.question}`} {...form.register(`answers.${question.id}`)}><option value="">Nota</option>{Array.from({ length: 11 }, (_, score) => <option key={score} value={score}>{score}</option>)}</select></label>)}</div></section>)}{error ? <div className="form-alert error" role="alert">{error}</div> : null}<div className="baseline-complete-bar"><span>{questions.length} perguntas no total</span><button className="primary-action" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? "Concluindo..." : "Salvar e concluir baseline"}</button></div></form>;
}
