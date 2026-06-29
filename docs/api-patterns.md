# Padroes de API - Kairos 360

## Backend

Framework oficial: Fastify.

## Validacao

Toda entrada deve ser validada com Zod.

Validar:

- body
- params
- query

## Padrao de resposta

Sucesso:

```json
{
  "data": {}
}
```

Lista:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

Erro:

```json
{
  "error": {
    "message": "Mensagem do erro",
    "code": "ERROR_CODE"
  }
}
```

## Direcao do dominio

As APIs devem refletir a organizacao dona da conta, nao uma carteira de clientes.

Modelo alvo:

- autenticacao
- organizacao
- usuarios da organizacao
- baseline diagnostico
- metricas manuais
- dashboard
- action plans
- reports
- depois data sources e ingestao

## Regra de desenho de API

As APIs devem ser opinadas e simples.

Preferir:

- poucos recursos bem definidos
- payloads claros
- fluxos previsiveis

Evitar:

- rotas altamente genericas
- customizacao excessiva por tenant
- endpoints que existem apenas para sustentar flexibilidade abstrata

## Rotas principais alvo

### Auth

- POST `/api/auth/sign-up/email`
- POST `/api/auth/sign-in/email`
- GET `/api/auth/get-session`
- POST `/auth/sign-out`

### Organization

- GET `/organization`
- PATCH `/organization`
- GET `/organization/users`
- POST `/organization/users`
- PATCH `/organization/users/:id/role`

### Baseline Diagnostic

- GET `/baseline-templates`
- GET `/baseline-templates/:id`
- POST `/baseline-templates`
- POST `/baseline-templates/:id/areas`
- POST `/baseline-template-areas/:id/questions`
- POST `/organization/baseline-setup/from-template`
- GET `/organization/baseline-areas`
- GET `/organization/baseline-areas/:id`
- POST `/organization/baseline-areas`
- POST `/organization/baseline-areas/:id/questions`
- PATCH `/organization/baseline-areas/:id`
- DELETE `/organization/baseline-areas/:id`
- PATCH `/organization/baseline-questions/:id`
- DELETE `/organization/baseline-questions/:id`
- POST `/baseline-diagnostics`
- GET `/baseline-diagnostics/:id`
- GET `/organization/baseline-diagnostics`
- POST `/baseline-diagnostics/:id/answers`
- GET `/baseline-diagnostics/:id/answers`
- PATCH `/baseline-diagnostic-answers/:id`
- DELETE `/baseline-diagnostic-answers/:id`
- POST `/baseline-diagnostics/:id/complete`
- GET `/baseline-diagnostics/:id/scores`

### Manual Metrics

- POST `/organization/manual-metrics`
- GET `/organization/manual-metrics`
- GET `/organization/manual-metrics/:id`
- PATCH `/organization/manual-metrics/:id`
- DELETE `/organization/manual-metrics/:id`

### Dashboard

- GET `/organization/dashboard`

### Action Plans

- POST `/action-plans`
- GET `/organization/action-plans`
- PATCH `/action-plans/:id`
- PATCH `/action-plans/:id/status`

### Reports

- POST `/reports/baseline/:diagnosticId/pdf`
- POST `/reports/baseline/:diagnosticId/excel`
- GET `/reports/:id`

### Data Sources

- POST `/organization/data-sources`
- GET `/organization/data-sources`
- GET `/organization/data-sources/:key`
- PATCH `/organization/data-sources/:key`
- DELETE `/organization/data-sources/:key`
- POST `/organization/data-sources/:key/sync`

### Data Ingestion

- POST `/data-ingestion/:sourceKey`
- GET `/organization/data-ingestion-logs`

### Business Events

- GET `/organization/business-events`
- GET `/organization/business-events/:id`

### Business Signals

- GET `/organization/business-signals`
- GET `/organization/business-signals/:id`

### Alerts

- GET `/organization/alerts`
- GET `/organization/alerts/active`
- PATCH `/alerts/:id/acknowledge`
- PATCH `/alerts/:id/resolve`

### Insights

- GET `/organization/insights`
- POST `/organization/insights/generate`

### Metrics History

- GET `/organization/metrics`
- GET `/organization/metrics/:metricKey/history`

## Regra de service

Nenhuma regra de negocio deve ficar no controller.

Controller apenas orquestra request/response.

Service executa a regra.

## Integracao Web e CORS

- A sessao usa cookie HTTP gerenciado pelo Better Auth.
- Requisicoes do navegador devem usar `credentials: "include"`.
- A API le as origens permitidas de `WEB_ORIGINS`, separadas por virgula.
- A mesma lista e usada pelo Fastify CORS e por `trustedOrigins` do Better Auth.

## Estado atual

As rotas implementadas hoje ainda refletem o dominio legado de `companies`.
Essas rotas devem ser tratadas como transitorias durante a refatoracao completa.

Nao ampliar o design legado em novas features.

## O que ja existe

- auth
- user session
- dominio legado de companies
- baseline manual legado
- dashboard
- action plans
- reports

## O que ainda falta para o dominio alvo

- organization routes
- organization users
- manual metrics
- refatoracao das rotas legadas de baseline
- data-source pipeline futuro
