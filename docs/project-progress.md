# Progresso do Projeto — Kairos 360

Este documento registra o estado atual do Kairos 360 e onde o desenvolvimento parou.

## Reposicionamento do Produto

O Kairos 360 foi reposicionado de **sistema de diagnóstico manual por questionário** para **SaaS de diagnóstico contínuo da saúde empresarial**.

Isso significa:

- O **diagnóstico manual (questionário 360°)** continua existindo como **baseline inicial**
- O core do produto passa a ser a **ingestão contínua de dados** de CRM, WhatsApp, Meta Ads, atendimento, comercial, financeiro e outras fontes
- Os **scores evoluem continuamente** com base em dados reais, não apenas em respostas de questionário
- O sistema processa dados em: **Business Events → Business Metrics → Business Signals → Insights**
- **Alertas** são gerados automaticamente quando sinais indicam risco ou oportunidade
- A **IA** atua como **camada interpretativa** sobre dados calculados pelo backend
- **Integrações externas** são modeladas como **Data Sources** (fontes de dados)
- **Tempo real** é tratado como **evolução futura**, não requisito do MVP

## Estado atual

O backend segue com:

```txt
Fastify
TypeScript
Drizzle
PostgreSQL
Better Auth
CRUD de empresas
Diagnóstico com template global + cópia editável por empresa
Scoring por empresa
Dashboard manual por empresa
Action plans
Reports estruturados do diagnóstico manual
```

## O que já existe

### Fundação

- Monorepo com `apps/api`, `apps/web`, `packages/shared` e `docs`.
- PostgreSQL via Docker Compose.
- Better Auth configurado.
- Roles de usuário:

```txt
admin
consultant
viewer
```

- Endpoint de usuário autenticado:

```txt
GET /users/me
```

### Empresas

- Módulo `companies` completo:

```txt
POST   /companies
GET    /companies
GET    /companies/:id
PATCH  /companies/:id
DELETE /companies/:id
```

- Toda empresa pertence ao usuário autenticado por `owner_user_id`.

### Novo modelo de diagnóstico

O modelo antigo de `areas` e `perguntas` globais foi substituído por:

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
Template é global.
Empresa recebe uma cópia própria e editável.
Diagnóstico responde apenas à estrutura da empresa.
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
PATCH /company-diagnostic-areas/:id
DELETE /company-diagnostic-areas/:id
PATCH /company-diagnostic-questions/:id
DELETE /company-diagnostic-questions/:id
```

### Rotas do diagnóstico

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

### Rotas de dashboard, planos e relatorios manuais

```txt
GET   /companies/:companyId/dashboard
POST  /action-plans
GET   /companies/:companyId/action-plans
PATCH /action-plans/:id
PATCH /action-plans/:id/status
POST  /reports/diagnostic/:diagnosticId/pdf
POST  /reports/diagnostic/:diagnosticId/excel
GET   /reports/:id
```

### Scoring

- Score da área: média das respostas daquela área da empresa.
- Score geral: média dos scores das áreas respondidas.
- Classificação:

```txt
0 a 4.9   = critical
5 a 7.4   = attention
7.5 a 10  = healthy
```

- O principal gargalo é a área com menor score.
- A segunda prioridade é a segunda menor área.

### Dashboard, action plans e relatórios manuais

- Dashboard consolidado por empresa com último diagnóstico concluído, score atual e resumo de action plans.
- Action plans vinculáveis à empresa, diagnóstico e área.
- Relatórios persistidos como snapshot estruturado do diagnóstico manual nos formatos `pdf` e `excel`.

## Banco de dados

### Migrations atuais

```txt
0000_broad_peter_quill.sql
0001_clear_warhawk.sql
0002_supreme_blindfold.sql
0003_polite_dazzler.sql
0004_aberrant_malcolm_colcord.sql
```

### O que a migration `0003_polite_dazzler.sql` faz

- Cria tabelas de templates.
- Cria tabelas de áreas e perguntas por empresa.
- Mantém `diagnostics`, `diagnostic_answers` e `diagnostic_scores`.
- Faz `answers` apontarem para `company_diagnostic_questions`.
- Faz `scores` apontarem para `company_diagnostic_areas`.

### O que a migration `0004_aberrant_malcolm_colcord.sql` faz

- Cria `action_plans`.
- Cria `reports`.
- Adiciona enums de status e formato para fechar o fluxo manual.

## Seed local

O seed foi adaptado para o novo modelo e agora cria:

- 3 usuários
- 3 empresas
- 1 template padrão
- cópia do template para as empresas
- diagnósticos fictícios
- respostas e scores coerentes com a estrutura da empresa
- action plans fictícios vinculados aos diagnósticos concluídos

Credenciais locais:

```txt
admin@kairos.local      / Kairos@123456
consultora@kairos.local / Kairos@123456
viewer@kairos.local     / Kairos@123456
```

## Validações feitas

```txt
pnpm.cmd --filter api exec tsc --noEmit
pnpm.cmd --filter api build
pnpm.cmd --filter api db:migrate
docker compose exec -T postgres pg_isready -U postgres -d diagnostico_360
```

## Onde paramos

Paramos com o novo modelo de diagnóstico flexível implementado no backend e no banco.

O fluxo core manual atual é:

```txt
1. Criar empresa
2. Criar ou listar template
3. Aplicar template na empresa
4. Ajustar áreas e perguntas da empresa
5. Criar diagnóstico (baseline manual)
6. Responder perguntas da empresa
7. Finalizar diagnóstico
8. Ler scores
9. Visualizar dashboard
10. Criar e acompanhar action plans
11. Gerar relatório estruturado
```

## Frontend implementado

O frontend possui uma base operacional fiel à linguagem visual do projeto de referência em
`./design`, adaptada ao domínio do Kairos 360.

### Entregas

- App shell responsivo com sidebar desktop e navegação inferior mobile.
- Dashboard operacional em `/` e `/dashboard`.
- Página de clientes em `/clientes`.
- Formulário de novo cliente integrado a `POST /companies`.
- Login em `/login` e cadastro em `/signup` integrados ao Better Auth.
- Logout server-side em `/logout`.
- Validação de sessão nas páginas privadas e redirecionamento para login.
- Redirecionamento de usuários autenticados para o dashboard ao acessar login ou signup.

### Estado de integração

```txt
Auth (login, signup, logout)     integrado à API
Criação de empresa              integrada à API
Listagem da carteira            integrada à API
Dashboard                       integrado à API por empresa
Detalhes/diagnósticos no web    ainda não implementados
```

### Configuração local do web

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

A API deve permitir a origem do frontend em `WEB_ORIGINS` e ambas as aplicações devem usar
`localhost` de forma consistente para que o cookie de sessão seja enviado corretamente.

## Próximo passo do frontend

Criar o detalhe do cliente e conectar o restante do fluxo manual já disponível no backend:
estrutura diagnóstica, diagnóstico, planos de ação e relatórios.

## Próximos passos recomendados

### 1. Data Sources (camada de configuração)

Após action plans, implementar a camada de **Data Sources**:

```txt
POST /companies/:companyId/data-sources
GET  /companies/:companyId/data-sources
GET  /companies/:companyId/data-sources/:key
PATCH /companies/:companyId/data-sources/:key
DELETE /companies/:companyId/data-sources/:key
POST /companies/:companyId/data-sources/:key/sync
```

### 2. Data Ingestion

Implementar ingestão batch/scheduled:

```txt
POST /data-ingestion/:sourceKey (webhook genérico)
GET  /companies/:companyId/data-ingestion-logs
```

### 3. Business Events, Signals e Alerts

Camada de processamento contínuo:

```txt
Business Events: GET /companies/:companyId/business-events
Business Signals: GET /companies/:companyId/business-signals
Alerts: GET /companies/:companyId/alerts, PATCH /alerts/:id/acknowledge, PATCH /alerts/:id/resolve
```

### 4. Insights Engine

Combinar regras + IA para gerar insights baseados em dados contínuos:

```txt
POST /companies/:companyId/ai/insights
GET  /companies/:companyId/insights
```

### 5. CRM, Meta Ads, WhatsApp

Integrações como data sources, seguindo a ordem de prioridade definida no AGENTS.md.

**Real-time processing é evolução futura.**
