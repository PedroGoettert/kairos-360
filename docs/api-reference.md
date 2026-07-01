# Referencia da API

## Aviso

Esta referencia descreve majoritariamente o **estado atual legado** da API.

O dominio atual implementado ainda usa `companies`, mas isso nao representa mais o modelo alvo do produto.

Novo alvo:

```txt
organization -> baseline manual -> metricas manuais -> dashboard -> action plans -> reports
```

## Execucao Local

Base URL local:

```txt
http://localhost:3333
```

## Autenticacao

- A autenticacao e feita pelo Better Auth em `/api/auth/*`.
- O usuario logado e identificado pelo cookie de sessao.

## Endpoints atuais implementados

### Auth

- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `GET /api/auth/get-session`
- `POST /auth/sign-out`
- `GET /users/me`

### Dominio legado atual

Estas rotas existem apenas por compatibilidade temporaria.

Elas:

- nao representam o dominio oficial do MVP
- nao devem receber novas features
- nao devem servir de base para novos contratos
- nao devem ser expandidas com novos endpoints `/companies`

- `POST /companies`
- `GET /companies`
- `GET /companies/:id`
- `PATCH /companies/:id`
- `DELETE /companies/:id`

- `GET /diagnostic-templates`
- `GET /diagnostic-templates/:id`
- `POST /diagnostic-templates`
- `POST /diagnostic-templates/:id/areas`
- `POST /diagnostic-template-areas/:id/questions`

- `POST /companies/:companyId/diagnostic-setup/from-template`
- `GET /companies/:companyId/diagnostic-areas`
- `GET /company-diagnostic-areas/:id`
- `POST /companies/:companyId/diagnostic-areas`
- `POST /company-diagnostic-areas/:id/questions`
- `PATCH /company-diagnostic-areas/:id`
- `DELETE /company-diagnostic-areas/:id`
- `PATCH /company-diagnostic-questions/:id`
- `DELETE /company-diagnostic-questions/:id`

- `POST /diagnostics`
- `GET /diagnostics/:id`
- `GET /companies/:companyId/diagnostics`
- `POST /diagnostics/:id/answers`
- `GET /diagnostics/:id/answers`
- `PATCH /diagnostic-answers/:id`
- `DELETE /diagnostic-answers/:id`
- `POST /diagnostics/:id/complete`
- `GET /diagnostics/:id/scores`

- `GET /companies/:companyId/dashboard`
- `POST /action-plans`
- `GET /companies/:companyId/action-plans`
- `PATCH /action-plans/:id`
- `PATCH /action-plans/:id/status`
- `POST /reports/diagnostic/:diagnosticId/pdf`
- `POST /reports/diagnostic/:diagnosticId/excel`
- `GET /reports/:id`

### Dominio novo ja implementado em paralelo

- `POST /organizations`
- `GET /organization`
- `PATCH /organization`
- `GET /organization/users`
- `POST /organization/users`
- `PATCH /organization/users/:id/role`

## Endpoints alvo apos a refatoracao

### Organization

- `POST /organizations`
- `GET /organization`
- `PATCH /organization`
- `GET /organization/users`
- `POST /organization/users`
- `PATCH /organization/users/:id/role`

### Baseline manual

- `GET /baseline-templates`
- `POST /organization/baseline-setup/from-template`
- `GET /organization/baseline-areas`
- `POST /baseline-diagnostics`
- `POST /baseline-diagnostics/:id/answers`
- `POST /baseline-diagnostics/:id/complete`
- `GET /baseline-diagnostics/:id/scores`

### Manual metrics

- `POST /organization/manual-metrics`
- `GET /organization/manual-metrics`
- `PATCH /organization/manual-metrics/:id`

### Dashboard

- `GET /organization/dashboard`

### Action plans

- `POST /action-plans`
- `GET /organization/action-plans`
- `PATCH /action-plans/:id`
- `PATCH /action-plans/:id/status`

### Reports

- `POST /reports/baseline/:diagnosticId/pdf`
- `POST /reports/baseline/:diagnosticId/excel`
- `GET /reports/:id`

### Fase posterior

- `POST /organization/data-sources`
- `GET /organization/data-sources`
- `POST /data-ingestion/:sourceKey`
- `GET /organization/business-events`
- `GET /organization/business-signals`
- `GET /organization/alerts`
- `GET /organization/insights`

## Regra importante

Nao criar novas APIs reforcando o dominio antigo de carteira de clientes.
As proximas implementacoes devem seguir a especificacao nova baseada em `organization`.
Nao criar novos endpoints com `companyId`, `company_id` ou prefixo `/companies`.

## Observacao de migracao

As rotas de `organization` ja existem e devem ser tratadas como a base do dominio novo.
As rotas de `companies` continuam disponiveis apenas para manter o legado funcionando durante a transicao.
