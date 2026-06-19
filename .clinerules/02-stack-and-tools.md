# Stack e Ferramentas Oficiais

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Recharts

## Backend

- Node.js 24
- Fastify
- TypeScript
- Zod
- Drizzle ORM
- PostgreSQL
- Better Auth

## Banco de dados

- PostgreSQL
- Drizzle ORM
- drizzle-kit para migrations

## IA

- OpenAI API
- Saídas estruturadas em JSON sempre que possível

## Infraestrutura inicial

- Docker Compose para ambiente local
- PostgreSQL via Docker
- Deploy futuro na AWS

## Gerenciador de pacotes

Usar pnpm como padrão.

Não usar npm ou yarn.

## TypeScript

Utilizar `@tsconfig/node24` na API.

Não utilizar `tsconfig` gerado pelo `tsc --init` se isso criar configuração excessivamente genérica.

Manter `strict` habilitado.

Habilitar quando possível:

- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`

Evitar desabilitar verificações de tipo.

## Regras gerais

- Não misturar Prisma com Drizzle.
- Não criar autenticação manual se Better Auth já estiver configurado.
- Não criar schemas duplicados no frontend e backend quando puder compartilhar tipos via `packages/shared`.
- Sempre validar entrada de dados com Zod.
- Sempre manter tipagem explícita em services, controllers e schemas.
