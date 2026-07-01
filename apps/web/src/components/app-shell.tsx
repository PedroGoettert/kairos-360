import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";

type AppShellProps = {
  activeNav: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", mobile: true },
  { label: "Baseline", href: "/baseline", mobile: false },
  { label: "Métricas", href: "/metricas", mobile: true },
  { label: "Sinais", href: "/sinais", mobile: true },
  { label: "Planos", href: "/planos", mobile: true },
  { label: "Relatórios", href: "/relatorios", mobile: false },
  { label: "Configurações", href: "/configuracoes", mobile: false },
] as const;

export function AppShell({ activeNav, eyebrow, title, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <BrandLogo />
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link
              className={item.label === activeNav ? "sidebar-link active" : "sidebar-link"}
              href={item.href}
              key={item.label}
            >
              <span className="sidebar-dot" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-card">
          <div className="eyebrow">Próxima rotina</div>
          <strong>Revisão executiva</strong>
          <span>Hoje, 14:30</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <BrandLogo compact />
          </div>
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
          </div>
          <div className="topbar-actions">
            <button className="period-button" type="button">
              Julho 2026
            </button>
            <form action="/logout" method="post">
              <button className="logout-link" type="submit">
                Sair
              </button>
            </form>
            <div className="avatar" aria-label="Usuário atual">
              KP
            </div>
          </div>
        </header>

        {children}
      </main>

      <nav className="bottom-nav" aria-label="Navegação mobile">
        {navItems.filter((item) => item.mobile).map((item) => (
          <Link
            className={item.label === activeNav ? "active" : ""}
            href={item.href}
            key={item.label}
          >
            <span />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
