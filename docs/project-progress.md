# Progresso do Projeto

Este documento registra o que ja foi configurado no Diagnostico 360 e onde o desenvolvimento parou.

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

A API possui fundacao funcional com Fastify, TypeScript, Drizzle, PostgreSQL, Better Auth, roles de usuario, preHandlers de autenticacao, CRUD de empresas e modulo de diagnosticos com respostas, finalizacao e scoring.

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
pnpm --filter api db:seed
```

Commit relacionado:

```txt
6960378 build(database): configure drizzle foundation
```

### Seed local

- Script de seed criado em:

```txt
apps/api/src/database/seed.ts
```

- O seed cria dados ficticios para desenvolvimento local:

```txt
3 usuarios com contas Better Auth
3 empresas
21 perguntas de diagnostico
4 diagnosticos
63 respostas
21 scores por area
```

- Credenciais locais:

```txt
admin@kairos.local      / Kairos@123456
consultora@kairos.local / Kairos@123456
viewer@kairos.local     / Kairos@123456
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

### Usuarios, roles e autenticacao interna

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

- Roles de usuario adicionadas:

```txt
admin
consultant
viewer
```

- Novos usuarios nascem como `admin`.
- `GET /users/me` retorna a role do usuario.
- PreHandlers de autenticacao/autorizacao criados em:

```txt
apps/api/src/auth/guards.ts
```

Guards atuais:

```txt
requireAuth
requireRole
getRequiredCurrentUser
```

- `FastifyRequest` foi tipado com `currentUser` em:

```txt
apps/api/src/types/fastify.d.ts
```

- Rota de logoff criada:

```txt
POST /auth/sign-out
```

Commits relacionados:

```txt
7ed73aa feat(users): add current user endpoint
6cc284c feat(companies): add companies module with user roles
5d45854 refactor(auth): add auth prehandlers
f45f70c feat(auth): add sign out route
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

### Documentacao de API

- Referencia de API criada em:

```txt
docs/api-reference.md
```

- A documentacao descreve:
  - execucao local;
  - padrao de resposta;
  - autenticacao por cookie;
  - roles;
  - rotas implementadas;
  - fluxo de teste no Insomnia;
  - erros comuns;
  - rotas planejadas.

Commit relacionado:

```txt
4bb754f docs(api): add API route reference
```

### Modulo de empresas

- Modulo `companies` criado seguindo a arquitetura definida:

```txt
apps/api/src/modules/companies/
  companies.routes.ts
  companies.controller.ts
  companies.service.ts
  companies.schemas.ts
  companies.types.ts
```

- Schema Drizzle criado em:

```txt
apps/api/src/database/schema/companies.ts
```

- Migration criada:

```txt
apps/api/src/database/migrations/0001_clear_warhawk.sql
```

- Cada empresa pertence ao usuario que criou a conta:

```txt
user 1:N companies
companies.owner_user_id -> user.id
```

- CRUD completo implementado:

```txt
POST   /companies
GET    /companies
GET    /companies/:id
PATCH  /companies/:id
DELETE /companies/:id
```

- Escrita em empresas exige `role = admin`.
- Todas as operacoes sao escopadas por `ownerUserId`.

Commits relacionados:

```txt
6cc284c feat(companies): add companies module with user roles
3129712 feat(companies): complete companies CRUD
```

### Fundacao do Diagnostico 360

- Schemas Drizzle criados:

```txt
apps/api/src/database/schema/diagnostic-areas.ts
apps/api/src/database/schema/diagnostic-questions.ts
apps/api/src/database/schema/diagnostics.ts
apps/api/src/database/schema/diagnostic-answers.ts
apps/api/src/database/schema/diagnostic-scores.ts
```

- Migration criada e aplicada localmente:

```txt
apps/api/src/database/migrations/0003_mean_gressill.sql
```

- Tabelas criadas:

```txt
diagnostic_areas
diagnostic_questions
diagnostics
diagnostic_answers
diagnostic_scores
```

- Areas padrao inseridas pela migration:

```txt
Marketing
Comercial
Operacao
Financeiro
Gestao
Atendimento
Recursos Humanos
```

- Constraint criada para respostas futuras:

```txt
diagnostic_answers.score >= 0 AND diagnostic_answers.score <= 10
```

- Modulo `diagnostics` criado:

```txt
apps/api/src/modules/diagnostics/
  diagnostics.routes.ts
  diagnostics.controller.ts
  diagnostics.service.ts
  diagnostics.schemas.ts
  diagnostics.types.ts
```

- Endpoints iniciais implementados:

```txt
GET /diagnostic-areas
GET /diagnostic-areas/:areaId
POST /diagnostic-areas/:areaId/questions
PATCH /diagnostic-questions/:id
PATCH /diagnostic-questions/:id/status
POST /diagnostics
GET /diagnostics/:id
GET /companies/:companyId/diagnostics
POST /diagnostics/:id/answers
GET /diagnostics/:id/answers
PATCH /diagnostic-answers/:id
DELETE /diagnostic-answers/:id
```

- Modulo `diagnostic-questions` criado para leitura da configuracao do formulario:

```txt
apps/api/src/modules/diagnostic-questions/
  diagnostic-questions.routes.ts
  diagnostic-questions.controller.ts
  diagnostic-questions.service.ts
  diagnostic-questions.schemas.ts
  diagnostic-questions.types.ts
```

- `GET /diagnostic-areas` retorna areas ativas com perguntas ativas, permitindo descobrir `questionId` para enviar respostas.
- `POST /diagnostic-areas/:areaId/questions` permite que usuarios `admin` criem perguntas em areas ativas.
- Perguntas podem ser editadas e ativadas/desativadas por usuarios `admin`.
- Todo diagnostico pertence a uma empresa.
- A API valida se a empresa pertence ao usuario logado antes de criar/listar/buscar diagnosticos.
- Diagnosticos nascem com:

```txt
status = draft
completed_at = null
```

- Respostas de diagnostico podem ser registradas em diagnosticos `draft`.
- Respostas de diagnostico podem ser listadas, atualizadas e removidas enquanto o diagnostico estiver em `draft`.
- A API valida se o diagnostico pertence a uma empresa do usuario logado.
- A API valida se a pergunta existe e esta ativa.
- A API bloqueia respostas duplicadas para a mesma pergunta no mesmo diagnostico.
- A API bloqueia novas respostas em diagnosticos ja finalizados.
- Diagnosticos podem ser finalizados por:

```txt
POST /diagnostics/:id/complete
```

- A finalizacao calcula e persiste scores por area na tabela `diagnostic_scores`.
- O score geral e calculado pela media dos scores das areas respondidas.
- A API identifica gargalo principal e segunda prioridade pelas areas com menor score.
- A classificacao de saude segue as regras do produto:

```txt
0 a 4.9   = critical
5 a 7.4   = attention
7.5 a 10  = healthy
```

- Scores de diagnosticos finalizados podem ser consultados por:

```txt
GET /diagnostics/:id/scores
```

Commits relacionados:

```txt
feat(diagnostics): create diagnostics foundation
feat(diagnostics): add diagnostic answers endpoint
```

## Validacoes ja realizadas

Durante a configuracao e evolucao do backend, foram validados:

```txt
pnpm.cmd --filter api exec tsc --noEmit
pnpm.cmd --filter api build
pnpm.cmd --filter api db:generate
pnpm.cmd --filter api db:migrate
docker compose up -d
docker compose exec -T postgres pg_isready -U postgres -d diagnostico_360
```

Tambem foram testados em momentos anteriores:

```txt
GET /health
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
GET /api/auth/get-session
GET /users/me
POST /companies
GET /companies
GET /companies/:id
```

## Observacoes importantes

- O arquivo real `apps/api/.env` nao deve ser commitado.
- O arquivo `apps/api/.env.example` deve continuar versionado como modelo.
- A tabela de autenticacao criada pela Better Auth chama-se `user`, no singular.
- A role padrao de novos usuarios e `admin`.
- O vinculo atual de empresa e `companies.owner_user_id -> user.id`.
- Ainda nao existe tabela `company_members`; se houver equipes por cliente, esta sera uma evolucao futura.
- O PostgreSQL roda via Docker Compose usando o banco `diagnostico_360`.
- A API usa a porta `3333` por padrao.

## Onde paramos

Paramos depois da implementacao de finalizacao e scoring do modulo `diagnostics`.

Ja existe:

```txt
GET /diagnostic-areas
GET /diagnostic-areas/:areaId
POST /diagnostic-areas/:areaId/questions
PATCH /diagnostic-questions/:id
PATCH /diagnostic-questions/:id/status
POST /diagnostics
GET /diagnostics/:id
GET /companies/:companyId/diagnostics
POST /diagnostics/:id/answers
GET /diagnostics/:id/answers
PATCH /diagnostic-answers/:id
DELETE /diagnostic-answers/:id
POST /diagnostics/:id/complete
GET /diagnostics/:id/scores
```

Ainda falta implementar a proxima camada de leitura consolidada:

```txt
GET /companies/:companyId/dashboard
```

## Proximos passos recomendados

### 1. Dashboard

Criar endpoint:

```txt
GET /companies/:companyId/dashboard
```

Deve exibir:

- saude geral;
- principal gargalo;
- segunda prioridade;
- evolucao mensal;
- status dos planos de acao.

### 2. Planos de acao

Criar modulo de action plans:

```txt
POST /action-plans
GET /companies/:companyId/action-plans
PATCH /action-plans/:id
PATCH /action-plans/:id/status
```

### 3. IA, relatorios e CRM

Somente depois do core:

- IA para resumo executivo;
- relatorios PDF/Excel;
- CRM;
- integracoes externas.

## Ordem recomendada atual

```txt
1. Dashboard
2. Action plans
3. IA
4. Relatorios
5. CRM
6. Integracoes
```
