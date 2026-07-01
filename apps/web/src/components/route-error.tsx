"use client";

type RouteErrorProps = { title: string; reset: () => void };
export function RouteError({ title, reset }: RouteErrorProps) {
  return <main className="route-state"><span className="data-label">Falha de comunicação</span><h1>{title}</h1><p>Verifique se a API está disponível e tente novamente.</p><button className="primary-action" onClick={reset} type="button">Tentar novamente</button></main>;
}
