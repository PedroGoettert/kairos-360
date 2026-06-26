import { z } from "zod";

export const signupFormSchema = z
  .object({
    name: z.string().trim().min(1, "Informe seu nome."),
    email: z.email("Informe um email valido."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });
