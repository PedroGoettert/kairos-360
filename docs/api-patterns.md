# Padrões de API — Kairos 360

## Backend

Framework oficial: Fastify.

## Validação

Toda entrada deve ser validada com Zod.

Validar:

- body
- params
- query

## Padrão de resposta

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

## Rotas principais

### Auth

- POST /api/auth/sign-up/email
- POST /api/auth/sign-in/email
- GET /api/auth/get-session
- POST /auth/sign-out

### Companies

- POST /companies
- GET /companies
- GET /companies/:id
- PATCH /companies/:id
- DELETE /companies/:id

### Diagnostics (Baseline Manual)

- POST /diagnostics
- GET /diagnostics/:id
- POST /diagnostics/:id/answers
- POST /diagnostics/:id/complete
- GET /companies/:companyId/diagnostics
- GET /diagnostics/:id/scores

### Diagnostic Templates

- GET /diagnostic-templates
- GET /diagnostic-templates/:id
- POST /diagnostic-templates
- POST /diagnostic-templates/:id/areas
- POST /diagnostic-template-areas/:id/questions

### Company Diagnostic Structure

- POST /companies/:companyId/diagnostic-setup/from-template
- GET /companies/:companyId/diagnostic-areas
- GET /company-diagnostic-areas/:id
- POST /companies/:companyId/diagnostic-areas
- POST /company-diagnostic-areas/:id/questions
- PATCH /company-diagnostic-areas/:id
- DELETE /company-diagnostic-areas/:id
- PATCH /company-diagnostic-questions/:id
- DELETE /company-diagnostic-questions/:id

### Dashboard

- GET /companies/:companyId/dashboard

### CRM

- POST /leads
- GET /leads
- GET /leads/:id
- PATCH /leads/:id/stage
- POST /leads/:id/notes
- POST /leads/:id/tasks

### Action Plans

- POST /action-plans
- GET /companies/:companyId/action-plans
- PATCH /action-plans/:id
- PATCH /action-plans/:id/status

### AI

- POST /diagnostics/:id/ai-summary
- POST /companies/:companyId/ai/insights (insights baseados em dados contínuos)

### Reports

- POST /reports/diagnostic/:diagnosticId/pdf
- POST /reports/diagnostic/:diagnosticId/excel
- POST /reports/company/:companyId/continuous/pdf (relatório de diagnóstico contínuo)

### Data Sources

- POST /companies/:companyId/data-sources
- GET /companies/:companyId/data-sources
- GET /companies/:companyId/data-sources/:key
- PATCH /companies/:companyId/data-sources/:key
- DELETE /companies/:companyId/data-sources/:key
- POST /companies/:companyId/data-sources/:key/sync (disparar sincronização manual)

### Data Ingestion

- POST /data-ingestion/:sourceKey (webhook genérico para receber dados de uma fonte)
- GET /companies/:companyId/data-ingestion-logs

### Business Events

- GET /companies/:companyId/business-events
- GET /companies/:companyId/business-events/:id

### Business Signals

- GET /companies/:companyId/business-signals
- GET /companies/:companyId/business-signals/:id

### Alerts

- GET /companies/:companyId/alerts
- GET /companies/:companyId/alerts/active
- PATCH /alerts/:id/acknowledge
- PATCH /alerts/:id/resolve

### Insights

- GET /companies/:companyId/insights
- GET /companies/:companyId/insights/:id

### Metrics History

- GET /companies/:companyId/metrics
- GET /companies/:companyId/metrics/:metricKey/history

## Regra de service

Nenhuma regra de negócio deve ficar no controller.

Controller apenas orquestra request/response.

Service executa a regra.

## Integração Web e CORS

- A sessão usa cookie HTTP gerenciado pelo Better Auth.
- Requisições do navegador devem usar `credentials: "include"`.
- A API lê as origens permitidas de `WEB_ORIGINS`, separadas por vírgula.
- A mesma lista é usada pelo Fastify CORS e por `trustedOrigins` do Better Auth.
- Em desenvolvimento, incluir explicitamente a origem exata do frontend, normalmente
  `http://localhost:3000`.
- `OPTIONS` e a resposta final da rota devem retornar os cabeçalhos CORS; um preflight bem-sucedido
  isoladamente não garante que a chamada real esteja configurada corretamente.

Exemplo:

```env
WEB_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Situação das rotas

As rotas de auth, users, companies, diagnostic templates, estrutura diagnóstica por empresa,
diagnostics, dashboard, action plans e reports estão implementadas. CRM, IA, data sources,
ingestion, events, signals, alerts, insights e metrics history permanecem planejadas.

A lista exata de endpoints disponíveis está em `docs/api-reference.md`.
