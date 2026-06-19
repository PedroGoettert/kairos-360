# Padrões de API

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

Auth:

- GET /auth/session
- POST /auth/sign-in
- POST /auth/sign-out

Companies:

- POST /companies
- GET /companies
- GET /companies/:id
- PATCH /companies/:id
- DELETE /companies/:id

Diagnostics:

- POST /diagnostics
- GET /diagnostics/:id
- POST /diagnostics/:id/answers
- POST /diagnostics/:id/complete
- GET /companies/:companyId/diagnostics
- GET /diagnostics/:id/scores

Dashboard:

- GET /companies/:companyId/dashboard

CRM:

- POST /leads
- GET /leads
- GET /leads/:id
- PATCH /leads/:id/stage
- POST /leads/:id/notes
- POST /leads/:id/tasks

Action Plans:

- POST /action-plans
- GET /companies/:companyId/action-plans
- PATCH /action-plans/:id
- PATCH /action-plans/:id/status

AI:

- POST /diagnostics/:id/ai-summary

Reports:

- POST /reports/diagnostic/:diagnosticId/pdf
- POST /reports/diagnostic/:diagnosticId/excel

## Regra de service

Nenhuma regra de negócio deve ficar no controller.

Controller apenas orquestra request/response.

Service executa a regra.
