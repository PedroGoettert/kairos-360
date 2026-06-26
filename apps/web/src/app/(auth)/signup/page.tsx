import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { SignupForm } from "@/features/auth/components/signup-form";
import { hasActiveSession } from "@/features/auth/server/session";

export default async function SignupPage() {
  if (await hasActiveSession()) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <BrandLogo />
        <div>
          <div className="badge">Acesso Kairos</div>
          <h2>Crie o acesso para operar diagnósticos.</h2>
          <p>
            Usuários criados entram na plataforma com autenticação Better Auth e
            sessão por cookie para acessar os módulos internos.
          </p>
        </div>
      </section>
      <SignupForm />
    </main>
  );
}
