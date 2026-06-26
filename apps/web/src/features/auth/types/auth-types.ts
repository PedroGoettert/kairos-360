import type { z } from "zod";
import type { loginFormSchema } from "@/features/auth/schemas/login-schema";

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type AuthErrorResponse = {
  error?: {
    message?: string;
    code?: string;
  };
  message?: string;
};
