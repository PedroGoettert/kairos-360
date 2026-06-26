"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/features/auth/schemas/login-schema";
import { signInWithEmail } from "@/features/auth/services/auth-service";
import type { LoginFormValues } from "@/features/auth/types/auth-types";

type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo = "/dashboard" }: LoginFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(input: LoginFormValues) {
    setSubmitError(null);

    try {
      await signInWithEmail(input);
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Nao foi possivel fazer login.",
      );
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
      <div className="auth-card-header">
        <div className="section-title">Acesso interno</div>
        <h1>Entrar na plataforma</h1>
        <p>Use seu email Kairos para acessar diagnósticos, clientes e planos.</p>
      </div>

      <label className="form-field required">
        <span>Email</span>
        <input
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          placeholder="voce@kairos.com.br"
          type="email"
          {...register("email")}
        />
        {errors.email?.message && <small>{errors.email.message}</small>}
      </label>

      <label className="form-field required">
        <span>Senha</span>
        <input
          aria-invalid={Boolean(errors.password)}
          autoComplete="current-password"
          placeholder="Sua senha"
          type="password"
          {...register("password")}
        />
        {errors.password?.message && <small>{errors.password.message}</small>}
      </label>

      {submitError && (
        <div className="form-alert error" role="alert">
          {submitError}
        </div>
      )}

      <button className="primary-action auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <p className="auth-switch">
        Ainda não tem acesso? <Link href="/signup">Criar usuário</Link>
      </p>
    </form>
  );
}
