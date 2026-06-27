# Referencia da API

Este documento descreve o fluxo atual da API do Diagnostico 360 com o novo modelo:

```txt
template global -> copia editavel por empresa -> diagnostico da empresa
```

## Execucao Local

Base URL local:

```txt
http://localhost:3333
```

Subir PostgreSQL:

```bash
docker compose up -d
```

Aplicar migrations:

```bash
pnpm --filter api db:migrate
```

Popular dados ficticios:

```bash
pnpm --filter api db:seed
```

## Padrao de Resposta

Sucesso:

```json
{
  "data": {}
}
```

Lista:

```json
{
  "data": []
}
```

Erro:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Autenticacao

- A autenticacao e feita pelo Better Auth em `/api/auth/*`.
- O usuario logado e identificado pelo cookie de sessao.
- No Insomnia, mantenha a cookie jar habilitada.

## Rotas Implementadas

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/health` | Nao | Health check. |
| POST | `/api/auth/sign-up/email` | Nao | Cria usuario. |
| POST | `/api/auth/sign-in/email` | Nao | Faz login. |
| GET | `/api/auth/get-session` | Cookie | Retorna sessao bruta do Better Auth. |
| POST | `/auth/sign-out` | Cookie | Encerra sessao. |
| GET | `/users/me` | Cookie | Retorna usuario atual. |
| POST | `/companies` | Cookie, role `admin` | Cria empresa. |
| GET | `/companies` | Cookie | Lista empresas do usuario. |
| GET | `/companies/:id` | Cookie | Busca empresa do usuario. |
| PATCH | `/companies/:id` | Cookie, role `admin` | Atualiza empresa. |
| DELETE | `/companies/:id` | Cookie, role `admin` | Remove empresa. |
| GET | `/diagnostic-templates` | Cookie | Lista templates globais com areas e perguntas. |
| GET | `/diagnostic-templates/:id` | Cookie | Busca template global especifico. |
| POST | `/diagnostic-templates` | Cookie, role `admin` | Cria template global. |
| POST | `/diagnostic-templates/:id/areas` | Cookie, role `admin` | Cria area em um template. |
| POST | `/diagnostic-template-areas/:id/questions` | Cookie, role `admin` | Cria pergunta em uma area de template. |
| POST | `/companies/:companyId/diagnostic-setup/from-template` | Cookie, role `admin` | Copia um template para a empresa. |
| GET | `/companies/:companyId/diagnostic-areas` | Cookie | Lista areas e perguntas da empresa. |
| GET | `/company-diagnostic-areas/:id` | Cookie | Busca uma area da empresa. |
| POST | `/companies/:companyId/diagnostic-areas` | Cookie, role `admin` | Cria area propria da empresa. |
| POST | `/company-diagnostic-areas/:id/questions` | Cookie, role `admin` | Cria pergunta propria da empresa. |
| PATCH | `/company-diagnostic-areas/:id` | Cookie, role `admin` | Atualiza area propria da empresa. |
| DELETE | `/company-diagnostic-areas/:id` | Cookie, role `admin` | Desativa area propria da empresa. |
| PATCH | `/company-diagnostic-questions/:id` | Cookie, role `admin` | Atualiza pergunta propria da empresa. |
| DELETE | `/company-diagnostic-questions/:id` | Cookie, role `admin` | Remove ou desativa pergunta propria da empresa. |
| POST | `/diagnostics` | Cookie | Cria diagnostico para uma empresa. |
| GET | `/diagnostics/:id` | Cookie | Busca diagnostico. |
| GET | `/companies/:companyId/diagnostics` | Cookie | Lista diagnosticos da empresa. |
| POST | `/diagnostics/:id/answers` | Cookie | Cria resposta usando pergunta da empresa. |
| GET | `/diagnostics/:id/answers` | Cookie | Lista respostas do diagnostico. |
| PATCH | `/diagnostic-answers/:id` | Cookie | Atualiza resposta de diagnostico em draft. |
| DELETE | `/diagnostic-answers/:id` | Cookie | Remove resposta de diagnostico em draft. |
| POST | `/diagnostics/:id/complete` | Cookie | Finaliza e calcula scores. |
| GET | `/diagnostics/:id/scores` | Cookie | Busca scores persistidos do diagnostico. |
| GET | `/companies/:companyId/dashboard` | Cookie | Consolida a visao manual da empresa. |
| POST | `/action-plans` | Cookie | Cria plano de acao manual. |
| GET | `/companies/:companyId/action-plans` | Cookie | Lista planos de acao da empresa. |
| PATCH | `/action-plans/:id` | Cookie | Atualiza dados principais do plano de acao. |
| PATCH | `/action-plans/:id/status` | Cookie | Atualiza status do plano de acao. |
| POST | `/reports/diagnostic/:diagnosticId/pdf` | Cookie | Gera snapshot estruturado do relatorio manual em formato PDF. |
| POST | `/reports/diagnostic/:diagnosticId/excel` | Cookie | Gera snapshot estruturado do relatorio manual em formato Excel. |
| GET | `/reports/:id` | Cookie | Busca um relatorio gerado. |

## Modelo Atual

Separacao de dados:

```txt
diagnostic_templates
  -> diagnostic_template_areas
    -> diagnostic_template_questions

companies
  -> company_diagnostic_areas
    -> company_diagnostic_questions
  -> diagnostics
    -> diagnostic_answers
    -> diagnostic_scores
```

Regras:

- Template e global.
- Empresa recebe uma copia editavel do template.
- Diagnostico responde apenas perguntas da propria empresa.
- Score e calculado apenas com areas da propria empresa.

## Fluxo Principal

### 1. Autenticacao

```txt
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
GET  /users/me
```

### 2. Empresa

```txt
POST /companies
GET  /companies
GET  /companies/:id
```

### 3. Template global

```txt
GET  /diagnostic-templates
GET  /diagnostic-templates/:id
POST /diagnostic-templates
POST /diagnostic-templates/:id/areas
POST /diagnostic-template-areas/:id/questions
```

### 4. Estrutura da empresa

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

### 5. Diagnostico

```txt
POST /diagnostics
GET  /diagnostics/:id
GET  /companies/:companyId/diagnostics
POST /diagnostics/:id/answers
GET  /diagnostics/:id/answers
POST /diagnostics/:id/complete
GET  /diagnostics/:id/scores
```

### 6. Dashboard

```txt
GET /companies/:companyId/dashboard
```

### 7. Planos de acao

```txt
POST  /action-plans
GET   /companies/:companyId/action-plans
PATCH /action-plans/:id
PATCH /action-plans/:id/status
```

### 8. Relatorios

```txt
POST /reports/diagnostic/:diagnosticId/pdf
POST /reports/diagnostic/:diagnosticId/excel
GET  /reports/:id
```

## Exemplos Rapidos

### POST `/diagnostic-templates`

```json
{
  "name": "Diagnostico Padrao",
  "slug": "diagnostico-padrao",
  "description": "Template base do Diagnostico 360.",
  "isDefault": true
}
```

### POST `/diagnostic-templates/:id/areas`

```json
{
  "name": "Marketing",
  "slug": "marketing",
  "description": "Area de marketing.",
  "displayOrder": 1
}
```

### POST `/diagnostic-template-areas/:id/questions`

```json
{
  "question": "A empresa possui posicionamento claro para seu publico-alvo?",
  "description": "Avalia proposta de valor e clareza de mercado.",
  "displayOrder": 1
}
```

### POST `/companies/:companyId/diagnostic-setup/from-template`

```json
{
  "templateId": "UUID_DO_TEMPLATE"
}
```

### POST `/companies/:companyId/diagnostic-areas`

```json
{
  "name": "Operacao",
  "slug": "operacao",
  "description": "Area adicional da empresa.",
  "displayOrder": 4
}
```

### POST `/company-diagnostic-areas/:id/questions`

```json
{
  "question": "A empresa tem rotina de controle operacional semanal?",
  "description": "Avalia acompanhamento da operacao.",
  "displayOrder": 1
}
```

### POST `/diagnostics`

```json
{
  "companyId": "UUID_DA_EMPRESA",
  "title": "Diagnostico inicial",
  "notes": "Primeira avaliacao do cliente."
}
```

### POST `/diagnostics/:id/answers`

```json
{
  "questionId": "UUID_DA_PERGUNTA_DA_EMPRESA",
  "score": 8,
  "comment": "Processo comercial bem definido."
}
```

### POST `/diagnostics/:id/complete`

```json
{}
```

### POST `/action-plans`

```json
{
  "companyId": "UUID_DA_EMPRESA",
  "diagnosticId": "UUID_DO_DIAGNOSTICO",
  "areaId": "UUID_DA_AREA",
  "title": "Estruturar rotina comercial",
  "description": "Plano para corrigir gargalo comercial identificado no diagnostico.",
  "responsible": "Marina Consultora",
  "dueDate": "2026-07-15T00:00:00.000Z",
  "status": "not_started"
}
```

### PATCH `/action-plans/:id/status`

```json
{
  "status": "in_progress"
}
```

## Erros Comuns

- `UNAUTHORIZED`: sem cookie de sessao valido.
- `FORBIDDEN`: usuario sem role necessaria para escrita.
- `COMPANY_NOT_FOUND`: empresa nao existe ou nao pertence ao usuario.
- `DIAGNOSTIC_TEMPLATE_NOT_FOUND`: template nao existe.
- `COMPANY_DIAGNOSTIC_SETUP_ALREADY_EXISTS`: a empresa ja recebeu uma copia de template.
- `COMPANY_DIAGNOSTIC_AREA_NOT_FOUND`: area da empresa nao encontrada.
- `DIAGNOSTIC_NOT_FOUND`: diagnostico nao encontrado para o usuario.
- `DIAGNOSTIC_ALREADY_COMPLETED`: diagnostico ja finalizado.
- `DIAGNOSTIC_NOT_COMPLETED`: scores ainda nao existem para esse diagnostico.
- `ACTION_PLAN_NOT_FOUND`: plano de acao nao encontrado.
- `REPORT_NOT_FOUND`: relatorio nao encontrado.

## Observacao sobre relatorios

As rotas de relatorio geram um snapshot estruturado persistido no backend para o diagnostico manual.
O formato (`pdf` ou `excel`) ja fica definido no registro, permitindo o front-end ou um worker futuro materializarem a exportacao binaria sem recalcular o diagnostico.
