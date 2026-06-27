# Kairos 360

SaaS de diagnóstico contínuo da saúde empresarial, organizado como monorepo com Next.js,
Fastify, PostgreSQL, Drizzle ORM e Better Auth.

## Aplicações

- `apps/web`: frontend Next.js.
- `apps/api`: API Fastify e acesso ao banco.
- `docs`: arquitetura, padrões, regras e estado do projeto.

## Desenvolvimento local

```bash
pnpm install
docker compose up -d
pnpm --filter api db:migrate
pnpm --filter api db:seed
pnpm dev:api
pnpm dev:web
```

URLs padrão:

```txt
Web: http://localhost:3000
API: http://localhost:3333
```

Variáveis essenciais:

```env
# apps/api/.env
WEB_ORIGINS=http://localhost:3000

# apps/web/.env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Consulte `docs/project-progress.md` para o estado atual e `docs/api-reference.md` para as rotas
implementadas.
