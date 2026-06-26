import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Informe um email valido."),
  password: z.string().min(1, "Informe sua senha."),
});
