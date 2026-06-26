import type { z } from "zod";
import type { loginFormSchema } from "@/features/auth/schemas/login-schema";
import type { signupFormSchema } from "@/features/auth/schemas/signup-schema";

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;

export type SignupInput = Omit<SignupFormValues, "confirmPassword">;

export type AuthErrorResponse = {
  error?: {
    message?: string;
    code?: string;
  };
  message?: string;
};
