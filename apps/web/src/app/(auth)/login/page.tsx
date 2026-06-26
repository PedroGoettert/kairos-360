import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "@/features/auth/components/login-form";
import { hasActiveSession } from "@/features/auth/server/session";

type LoginPageProps = {
  searchParams?: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params?.redirectTo?.startsWith("/")
    ? params.redirectTo
    : "/dashboard";

  if (await hasActiveSession()) {
    redirect(redirectTo);
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <BrandLogo />
        <div>
          <div className="badge">Diagnóstico 360</div>
          <h2>Rotina consultiva com dados, gargalos e ação.</h2>
          <p>
            Acesse clientes, diagnósticos, dashboard executivo e planos de ação
            em uma experiência única para a equipe Kairos.
          </p>
        </div>
      </section>
      <LoginForm redirectTo={redirectTo} />
    </main>
  );
}
