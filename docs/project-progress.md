# Progresso do Projeto

Este documento registra o estado atual do Diagnostico 360 e onde o desenvolvimento parou.

## Estado atual

O backend segue com:

```txt
Fastify
TypeScript
Drizzle
PostgreSQL
Better Auth
CRUD de empresas
Diagnostico com template global + copia editavel por empresa
Scoring por empresa
```

## O que ja existe

### Fundacao

- Monorepo com `apps/api`, `apps/web`, `packages/shared` e `docs`.
- PostgreSQL via Docker Compose.
- Better Auth configurado.
- Roles de usuario:

```txt
admin
consultant
viewer
```

- Endpoint de usuario autenticado:

```txt
GET /users/me
```

### Empresas

- Modulo `companies` completo:

```txt
POST   /companies
GET    /companies
GET    /companies/:id
PATCH  /companies/:id
DELETE /companies/:id
```

- Toda empresa pertence ao usuario autenticado por `owner_user_id`.

### Novo modelo de diagnostico

O modelo antigo de `areas` e `perguntas` globais foi substituido por:

```txt
diagnostic_templates
  -> diagnostic_template_areas
    -> diagnostic_template_questions

companies
  -> company_diagnostic_areas
    -> company_diagnostic_questions

diagnostics
  -> diagnostic_answers
  -> diagnostic_scores
```

Regra principal:

```txt
Template e global.
Empresa recebe uma copia propria e editavel.
Diagnostico responde apenas a estrutura da empresa.
```

### Rotas de templates

```txt
GET  /diagnostic-templates
GET  /diagnostic-templates/:id
POST /diagnostic-templates
POST /diagnostic-templates/:id/areas
POST /diagnostic-template-areas/:id/questions
```

### Rotas da estrutura da empresa

```txt
POST /companies/:companyId/diagnostic-setup/from-template
GET  /companies/:companyId/diagnostic-areas
GET  /company-diagnostic-areas/:id
POST /companies/:companyId/diagnostic-areas
POST /company-diagnostic-areas/:id/questions
```

### Rotas do diagnostico

```txt
POST   /diagnostics
GET    /diagnostics/:id
GET    /companies/:companyId/diagnostics
POST   /diagnostics/:id/answers
GET    /diagnostics/:id/answers
PATCH  /diagnostic-answers/:id
DELETE /diagnostic-answers/:id
POST   /diagnostics/:id/complete
GET    /diagnostics/:id/scores
```

### Scoring

- Score da area: media das respostas daquela area da empresa.
- Score geral: media dos scores das areas respondidas.
- Classificacao:

```txt
0 a 4.9   = critical
5 a 7.4   = attention
7.5 a 10  = healthy
```

- O principal gargalo e a area com menor score.
- A segunda prioridade e a segunda menor area.

## Banco de dados

### Migrations atuais

```txt
0000_broad_peter_quill.sql
0001_clear_warhawk.sql
0002_supreme_blindfold.sql
0003_polite_dazzler.sql
```

### O que a migration `0003_polite_dazzler.sql` faz

- Cria tabelas de templates.
- Cria tabelas de areas e perguntas por empresa.
- Mantem `diagnostics`, `diagnostic_answers` e `diagnostic_scores`.
- Faz `answers` apontarem para `company_diagnostic_questions`.
- Faz `scores` apontarem para `company_diagnostic_areas`.

## Seed local

O seed foi adaptado para o novo modelo e agora cria:

- 3 usuarios
- 3 empresas
- 1 template padrao
- copia do template para as empresas
- diagnosticos ficticios
- respostas e scores coerentes com a estrutura da empresa

Credenciais locais:

```txt
admin@kairos.local      / Kairos@123456
consultora@kairos.local / Kairos@123456
viewer@kairos.local     / Kairos@123456
```

## Validacoes feitas

```txt
pnpm.cmd --filter api exec tsc --noEmit
pnpm.cmd --filter api build
pnpm.cmd --filter api db:migrate
docker compose exec -T postgres pg_isready -U postgres -d diagnostico_360
```

## Onde paramos

Paramos com o novo modelo de diagnostico flexivel implementado no backend e no banco.

O fluxo core agora e:

```txt
1. Criar empresa
2. Criar ou listar template
3. Aplicar template na empresa
4. Ajustar areas e perguntas da empresa
5. Criar diagnostico
6. Responder perguntas da empresa
7. Finalizar diagnostico
8. Ler scores
```

## Proximo passo recomendado

### 1. Dashboard

Criar:

```txt
GET /companies/:companyId/dashboard
```

Esse endpoint deve ler o novo modelo por empresa e exibir:

- saude geral
- gargalo principal
- segunda prioridade
- evolucao mensal
- status dos planos de acao

### 2. Rotas de edicao da estrutura da empresa

Para completar a flexibilidade prometida, ainda faltam as rotas de manutencao:

```txt
PATCH /company-diagnostic-areas/:id
DELETE /company-diagnostic-areas/:id
PATCH /company-diagnostic-questions/:id
DELETE /company-diagnostic-questions/:id
```

### 3. Action plans

```txt
POST /action-plans
GET  /companies/:companyId/action-plans
PATCH /action-plans/:id
PATCH /action-plans/:id/status
```
