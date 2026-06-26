"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signupFormSchema } from "@/features/auth/schemas/signup-schema";
import { signUpWithEmail } from "@/features/auth/services/auth-service";
import type { SignupFormValues } from "@/features/auth/types/auth-types";

export function SignupForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignupFormValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
    resolver: zodResolver(signupFormSchema),
  });

  async function onSubmit(input: SignupFormValues) {
    setSubmitError(null);
    const { confirmPassword: _confirmPassword, ...signupInput } = input;

    try {
      await signUpWithEmail(signupInput);
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Nao foi possivel criar usuario.",
      );
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
      <div className="auth-card-header">
        <div className="section-title">Novo acesso</div>
        <h1>Criar usuario</h1>
        <p>Cadastre um usuário para acessar a plataforma Diagnóstico 360.</p>
      </div>

      <label className="form-field required">
        <span>Nome</span>
        <input
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          placeholder="Seu nome"
          type="text"
          {...register("name")}
        />
        {errors.name?.message && <small>{errors.name.message}</small>}
      </label>

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
          autoComplete="new-password"
          placeholder="Minimo de 8 caracteres"
          type="password"
          {...register("password")}
        />
        {errors.password?.message && <small>{errors.password.message}</small>}
      </label>

      <label className="form-field required">
        <span>Confirmar senha</span>
        <input
          aria-invalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          placeholder="Repita sua senha"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword?.message && (
          <small>{errors.confirmPassword.message}</small>
        )}
      </label>

      {submitError && (
        <div className="form-alert error" role="alert">
          {submitError}
        </div>
      )}

      <button className="primary-action auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Criando..." : "Criar usuario"}
      </button>

      <p className="auth-switch">
        Ja tem acesso? <Link href="/login">Entrar</Link>
      </p>
    </form>
  );
}
