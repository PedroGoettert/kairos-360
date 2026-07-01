import { z } from "zod";

export const actionPlanDraftSchema = z.object({
  title: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres."),
  objective: z.string().trim().min(10, "Descreva o resultado esperado."),
  responsible: z.string().trim().min(2, "Informe o responsável."),
  dueDate: z.string().min(1, "Informe o prazo."),
});

export type ActionPlanDraftInput = z.infer<typeof actionPlanDraftSchema>;
