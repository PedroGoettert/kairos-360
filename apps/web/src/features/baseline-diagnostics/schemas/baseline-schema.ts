import { z } from "zod";
export const newBaselineSchema = z.object({ title: z.string().trim().max(120).transform((value) => value || null) });
export const baselineAnswersSchema = z.object({ answers: z.record(z.string(), z.coerce.number().int().min(0).max(10)) });
export type NewBaselineInput = z.input<typeof newBaselineSchema>;
export type NewBaselineOutput = z.output<typeof newBaselineSchema>;
export type BaselineAnswersInput = z.input<typeof baselineAnswersSchema>;
export type BaselineAnswersOutput = z.output<typeof baselineAnswersSchema>;
