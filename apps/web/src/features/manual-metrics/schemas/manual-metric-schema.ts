import { z } from "zod";

import { manualMetricCategories } from "@/features/manual-metrics/types/manual-metrics-types";

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  });

export const manualMetricFormSchema = z.object({
  category: z.enum(manualMetricCategories),
  metricLabel: z.string().trim().min(1, "Informe o nome da metrica."),
  metricKey: z.string().trim().min(1, "Informe a chave da metrica."),
  value: z.preprocess(
    (value) => (value === "" ? Number.NaN : value),
    z.coerce.number().finite("Informe um valor numerico valido."),
  ),
  unit: optionalTextSchema,
  referenceDate: z.string().min(1, "Informe a data de referencia."),
  notes: optionalTextSchema,
});

export type ManualMetricFormInput = z.input<typeof manualMetricFormSchema>;
export type ManualMetricFormOutput = z.output<typeof manualMetricFormSchema>;
