# Progresso do Projeto

Este documento registra o que ja foi configurado no Diagnostico 360 e os proximos passos planejados.

## Estado atual

O projeto esta organizado como monorepo com:

```txt
apps/
  api/
  web/
packages/
  shared/
docs/
```

A API ja possui fundacao funcional com Fastify, TypeScript, Drizzle, PostgreSQL, Better Auth e endpoint de usuario autenticado.

## O que ja foi feito

### Fundacao do monorepo

- Estrutura base criada com `apps/api`, `apps/web`, `packages/shared` e `docs`.
- Workspace configurado com `pnpm-workspace.yaml`.
- Scripts raiz configurados para web, api, build e lint.
- Docker Compose configurado com PostgreSQL.
- Documentacao inicial criada em `docs/`.
- `AGENTS.md` criado com regras de arquitetura, stack, fluxo de desenvolvimento e prioridade de implementacao.

Commits relacionados:

```txt
9810b62 chore(project): initialize monorepo foundation
5bde250 docs(agents): add mandatory docs reading instructions
```

### Fundacao da API

- API configurada com Node 24, TypeScript, ESM e `@tsconfig/node24`.
- Fastify configurado em `apps/api/src/server.ts`.
- Carregamento e validacao de ambiente com Zod em `apps/api/src/env/index.ts`.
- Estrutura inicial de plugins criada em `apps/api/src/plugins`.
- Rota de health check criada:

```txt
GET /health
```

Resposta esperada:

```json
{
  "data": {
    "status": "ok"
  }
}
```

Commit relacionado:

```txt
110f90f build(api): configure fastify foundation
```

### Banco de dados e Drizzle

- PostgreSQL configurado via `docker-compose.yml`.
- Drizzle ORM configurado.
- `drizzle-kit` configurado.
- Arquivo `apps/api/drizzle.config.ts` criado.
- Conexao inicial com o banco criada em:

```txt
apps/api/src/database/index.ts
```

- Estrutura de schema padronizada em:

```txt
apps/api/src/database/schema/
```

- Scripts adicionados na API:

```txt
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm --filter api db:studio
```

Commit relacionado:

```txt
6960378 build(database): configure drizzle foundation
```

### Better Auth

- Better Auth configurado com Drizzle Adapter e PostgreSQL.
- CORS configurado para frontend separado.
- Plugin de auth criado e registrado no Fastify.
- Rota base do Better Auth registrada:

```txt
/api/auth/*
```

- Auth configurado em:

```txt
apps/api/src/auth/index.ts
```

- Tabelas padrao da Better Auth geradas:

```txt
user
session
account
verification
```

- Migration inicial criada e aplicada:

```txt
apps/api/src/database/migrations/0000_broad_peter_quill.sql
```

- Endpoints Better Auth ja testados:

```txt
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
GET /api/auth/get-session
```

Commit relacionado:

```txt
cd3eb60 build(auth): configure better auth foundation
```

### Usuario autenticado

- Helper de sessao criado em:

```txt
apps/api/src/auth/session.ts
```

- Modulo `users` criado seguindo a arquitetura definida:

```txt
apps/api/src/modules/users/
  users.routes.ts
  users.controller.ts
  users.service.ts
  users.schemas.ts
  users.types.ts
```

- Endpoint criado:

```txt
GET /users/me
```

Com sessao valida, retorna:

```json
{
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "emailVerified": false
  }
}
```

Sem sessao, retorna:

```json
{
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

Commit relacionado:

```txt
7ed73aa feat(users): add current user endpoint
```

### Variaveis de ambiente

- `apps/api/.env` local criado e mantido fora do Git.
- `apps/api/.env.example` mantido como modelo versionado.
- Defaults sensiveis removidos do Zod.
- Variaveis obrigatorias validadas na inicializacao da API.
- `WEB_ORIGINS` configurado para aceitar multiplas origins separadas por virgula.
- `WEB_ORIGIN` ainda e aceito como fallback temporario.

Variaveis atuais da API:

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=3333
DATABASE_URL=postgres://postgres:postgres@localhost:5432/diagnostico_360
BETTER_AUTH_SECRET=change-me-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3333
WEB_ORIGINS=http://localhost:3000,http://localhost:3333,http://127.0.0.1:3333
```

Commit relacionado:

```txt
d136090 build(env): require api environment variables
```

### Atualizacao de padrao Zod

- Schemas atualizados para usar helpers top-level do Zod 4.
- Exemplos:

```ts
z.url()
z.email()
```

Em vez de:

```ts
z.string().url()
z.string().email()
```

Commit relacionado:

```txt
a39ab84 refactor(api): use zod top-level string formats
```

## Validacoes ja realizadas

Durante a configuracao, foram validados:

```txt
pnpm.cmd --filter api exec tsc --noEmit
pnpm.cmd --filter api build
docker compose up -d
docker compose exec -T postgres pg_isready -U postgres -d diagnostico_360
```

Tambem foram testados:

```txt
GET /health
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
GET /api/auth/get-session
GET /users/me
```

## Observacoes importantes

- O arquivo real `apps/api/.env` nao deve ser commitado.
- O arquivo `apps/api/.env.example` deve continuar versionado como modelo.
- A tabela de autenticacao criada pela Better Auth chama-se `user`, no singular.
- Antes de criar regras mais complexas de usuarios, deve-se decidir se a tabela `user` sera a tabela principal de usuarios do dominio ou se havera uma tabela/perfil complementar.
- O PostgreSQL roda via Docker Compose usando o banco `diagnostico_360`.
- A API usa a porta `3333` por padrao.

## Mudancas pendentes

- `apps/api/src/modules/.gitkeep` foi removido porque a pasta `modules` ja possui o modulo `users`.
- Ainda falta criar commit para essa remocao, caso seja mantida.

## Proximos passos planejados

### 1. Modulo de empresas

Proximo modulo recomendado:

```txt
apps/api/src/modules/companies/
  companies.routes.ts
  companies.controller.ts
  companies.service.ts
  companies.schemas.ts
  companies.types.ts
```

Schema recomendado:

```txt
apps/api/src/database/schema/companies.ts
```

Endpoints iniciais:

```txt
POST /companies
GET /companies
GET /companies/:id
```

Objetivo:

- Criar a primeira entidade de negocio real.
- Vincular empresas ao usuario autenticado.
- Preparar base multiempresa para diagnosticos, dashboard, CRM, planos de acao e relatorios.

Commit sugerido:

```txt
feat(companies): create companies module
```

### 2. Relacionamento usuario-empresa

Decidir como representar o vinculo entre usuario e empresa:

- Campo direto `owner_user_id` em `companies`.
- Ou tabela de relacionamento, por exemplo `company_members`, para suportar multiplos usuarios por empresa no futuro.

Sugestao inicial:

- Se o MVP tiver apenas consultor dono da empresa, usar `owner_user_id`.
- Se houver equipe/acessos por empresa, criar `company_members` desde o inicio.

### 3. Diagnostico 360

Depois de empresas:

```txt
diagnostic-areas
diagnostic-questions
diagnostics
diagnostic-answers
diagnostic-scores
```

Objetivo:

- Criar areas padrao.
- Criar perguntas configuraveis.
- Aplicar diagnostico.
- Calcular scores.

### 4. Dashboard

Depois de diagnostico e scores:

```txt
GET /companies/:companyId/dashboard
```

Deve exibir:

- Saude geral.
- Principal gargalo.
- Segunda prioridade.
- Evolucao mensal.
- Status de planos de acao.

### 5. Planos de acao

Criar modulo de action plans:

```txt
POST /action-plans
GET /companies/:companyId/action-plans
PATCH /action-plans/:id
PATCH /action-plans/:id/status
```

### 6. IA, relatorios e CRM

Somente depois do core:

- IA para resumo executivo.
- Relatorios PDF/Excel.
- CRM.
- Integracoes externas.

## Ordem recomendada atual

```txt
1. Commit da remocao do .gitkeep de modules
2. Modulo companies
3. Relacionamento usuario-empresa
4. Diagnostico 360
5. Scoring
6. Dashboard
7. Action plans
8. IA
9. Relatorios
10. CRM
11. Integracoes
```
