# Referencia da API

Este documento descreve as rotas atualmente implementadas na API do Diagnostico 360 e como testa-las manualmente.

## Execucao Local

Base URL local:

```txt
http://localhost:3333
```

Subir PostgreSQL:

```bash
docker compose up -d
```

Rodar a API compilada a partir de `apps/api/dist/server.js`:

```bash
pnpm --filter api build
pnpm --filter api start
```

Rodar a API em modo desenvolvimento:

```bash
pnpm dev:api
```

Popular o banco local com dados ficticios:

```bash
pnpm --filter api db:seed
```

Usuarios criados pelo seed:

```txt
admin@kairos.local      / Kairos@123456
consultora@kairos.local / Kairos@123456
viewer@kairos.local     / Kairos@123456
```

## Padrao de Resposta

Resposta de sucesso para recurso unico:

```json
{
  "data": {}
}
```

Resposta de sucesso para listas:

```json
{
  "data": []
}
```

Resposta de erro:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Autenticacao

A autenticacao e feita pelo Better Auth nas rotas sob `/api/auth/*`.

A API nao aceita `userId`, `ownerUserId` ou `role` enviados pelo cliente em headers ou body. O usuario autenticado e resolvido pelo cookie de sessao emitido depois do login.

No Insomnia, mantenha a cookie jar habilitada. Depois de um login bem-sucedido, o Insomnia deve armazenar o header `Set-Cookie` e enviar o cookie automaticamente nas proximas requisicoes.

Use esta rota para confirmar que o cookie de sessao esta funcionando:

```txt
GET /users/me
```

Se a rota retornar o usuario atual, as rotas autenticadas como `/companies` tambem conseguem identificar o usuario logado.

## Funcoes de Usuario

As roles atuais sao:

```txt
admin
consultant
viewer
```

Comportamento atual:

- Novos usuarios sao criados como `admin` por padrao.
- `admin` pode criar empresas.
- Empresas sao escopadas pelo usuario autenticado.
- `consultant` e `viewer` estao preparadas para regras futuras de permissao.

## Rotas Implementadas

| Metodo | Rota | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/health` | Nao | Verifica se a API esta disponivel. |
| POST | `/api/auth/sign-up/email` | Nao | Cria usuario com email e senha. |
| POST | `/api/auth/sign-in/email` | Nao | Faz login e emite cookie de sessao. |
| GET | `/api/auth/get-session` | Cookie | Retorna a sessao atual do Better Auth. |
| POST | `/auth/sign-out` | Cookie | Encerra a sessao atual do usuario. |
| GET | `/users/me` | Cookie | Retorna o usuario atual da aplicacao. |
| POST | `/companies` | Cookie, role `admin` | Cria uma empresa para o admin logado. |
| GET | `/companies` | Cookie | Lista empresas do usuario logado. |
| GET | `/companies/:id` | Cookie | Busca uma empresa do usuario logado. |
| PATCH | `/companies/:id` | Cookie, role `admin` | Atualiza uma empresa do usuario logado. |
| DELETE | `/companies/:id` | Cookie, role `admin` | Remove uma empresa do usuario logado. |
| GET | `/diagnostic-areas` | Cookie | Lista areas do diagnostico com perguntas ativas. |
| POST | `/diagnostic-areas/:areaId/questions` | Cookie, role `admin` | Cria uma pergunta em uma area do diagnostico. |
| POST | `/diagnostics` | Cookie | Cria um diagnostico para uma empresa do usuario logado. |
| GET | `/diagnostics/:id` | Cookie | Busca um diagnostico do usuario logado. |
| GET | `/companies/:companyId/diagnostics` | Cookie | Lista diagnosticos de uma empresa do usuario logado. |
| POST | `/diagnostics/:id/answers` | Cookie | Registra uma resposta para uma pergunta do diagnostico. |
| GET | `/diagnostics/:id/answers` | Cookie | Lista respostas registradas em um diagnostico. |
| PATCH | `/diagnostic-answers/:id` | Cookie | Atualiza uma resposta de diagnostico em andamento. |

## Health

### GET `/health`

Verifica se o processo da API esta rodando.

Resposta esperada:

```json
{
  "data": {
    "status": "ok"
  }
}
```

## Auth

### POST `/api/auth/sign-up/email`

Cria um novo usuario. No schema atual, o usuario nasce com `role = admin`.

Body:

```json
{
  "name": "Admin Kairos",
  "email": "admin@kairos.com",
  "password": "12345678"
}
```

Observacoes:

- Use um email unico para cada usuario de teste.
- O Better Auth controla o formato exato da resposta.
- Se a requisicao funcionar, o usuario e persistido na tabela `user`.

### POST `/api/auth/sign-in/email`

Faz login com email e senha.

Body:

```json
{
  "email": "admin@kairos.com",
  "password": "12345678"
}
```

Detalhe importante da resposta:

```txt
Set-Cookie: better-auth.session_token=...
```

O Insomnia deve armazenar esse cookie. Nao envie `userId` manualmente em header ou body.

### GET `/api/auth/get-session`

Retorna a sessao Better Auth associada ao cookie atual.

Use esta rota quando quiser inspecionar a sessao bruta de autenticacao.

### POST `/auth/sign-out`

Encerra a sessao atual e remove o cookie de autenticacao.

Autenticacao:

```txt
Cookie de sessao recomendado
```

Body:

```json
{}
```

Resposta esperada:

```json
{
  "success": true
}
```

Depois do logoff, chamadas autenticadas como `GET /users/me` devem retornar `UNAUTHORIZED`.

## Users

### GET `/users/me`

Retorna o usuario atual da aplicacao.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Resposta esperada:

```json
{
  "data": {
    "id": "user_id",
    "name": "Admin Kairos",
    "email": "admin@kairos.com",
    "emailVerified": false,
    "image": null,
    "role": "admin"
  }
}
```

Resposta sem sessao:

```json
{
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

## Companies

Empresas representam os clientes atendidos no Diagnostico 360.

Modelo atual de propriedade:

```txt
user 1:N companies
```

Cada empresa possui `ownerUserId`. A API define esse valor a partir da sessao autenticada. O cliente nao deve enviar `ownerUserId`.

### POST `/companies`

Cria uma empresa para o usuario admin logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
role = admin obrigatoria
```

Body:

```json
{
  "name": "Cliente Exemplo LTDA",
  "tradeName": "Cliente Exemplo",
  "document": "12.345.678/0001-90",
  "industry": "Servicos",
  "website": "https://clienteexemplo.com.br",
  "notes": "Cliente criado para teste no Diagnostico 360."
}
```

Campos obrigatorios:

```txt
name
```

Campos opcionais:

```txt
tradeName
document
industry
website
notes
```

Regras de validacao:

- `name` deve ser uma string nao vazia.
- `website`, quando enviado, deve ser uma URL valida.
- Campos opcionais de texto podem ser omitidos ou enviados como `null`.

Resposta esperada:

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerUserId": "user_id",
    "name": "Cliente Exemplo LTDA",
    "tradeName": "Cliente Exemplo",
    "document": "12.345.678/0001-90",
    "industry": "Servicos",
    "website": "https://clienteexemplo.com.br",
    "notes": "Cliente criado para teste no Diagnostico 360.",
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T10:00:00.000Z"
  }
}
```

Resposta sem permissao:

```json
{
  "error": {
    "message": "Forbidden",
    "code": "FORBIDDEN"
  }
}
```

### GET `/companies`

Lista empresas do usuario logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Resposta esperada:

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "ownerUserId": "user_id",
      "name": "Cliente Exemplo LTDA",
      "tradeName": "Cliente Exemplo",
      "document": "12.345.678/0001-90",
      "industry": "Servicos",
      "website": "https://clienteexemplo.com.br",
      "notes": "Cliente criado para teste no Diagnostico 360.",
      "createdAt": "2026-06-24T10:00:00.000Z",
      "updatedAt": "2026-06-24T10:00:00.000Z"
    }
  ]
}
```

Observacoes:

- A resposta e ordenada por `createdAt` decrescente.
- A rota nao retorna empresas de outros usuarios.

### GET `/companies/:id`

Retorna uma empresa por ID, escopada ao usuario logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Path params:

```txt
id: UUID
```

Exemplo:

```txt
GET /companies/550e8400-e29b-41d4-a716-446655440000
```

Resposta esperada:

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerUserId": "user_id",
    "name": "Cliente Exemplo LTDA",
    "tradeName": "Cliente Exemplo",
    "document": "12.345.678/0001-90",
    "industry": "Servicos",
    "website": "https://clienteexemplo.com.br",
    "notes": "Cliente criado para teste no Diagnostico 360.",
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T10:00:00.000Z"
  }
}
```

Resposta quando nao encontrada:

```json
{
  "error": {
    "message": "Company not found",
    "code": "COMPANY_NOT_FOUND"
  }
}
```

Essa resposta e usada quando:

- a empresa nao existe;
- a empresa existe, mas pertence a outro usuario.

### PATCH `/companies/:id`

Atualiza uma empresa por ID, escopada ao usuario admin logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
role = admin obrigatoria
```

Path params:

```txt
id: UUID
```

Body:

```json
{
  "name": "Cliente Exemplo Atualizado LTDA",
  "tradeName": "Cliente Atualizado",
  "industry": "Tecnologia",
  "website": "https://clienteatualizado.com.br",
  "notes": "Dados atualizados no cadastro do cliente."
}
```

Regras de validacao:

- envie pelo menos um campo;
- `name`, quando enviado, deve ser uma string nao vazia;
- `website`, quando enviado, deve ser uma URL valida;
- campos opcionais podem ser enviados como `null` para limpar o valor.

Resposta esperada:

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerUserId": "user_id",
    "name": "Cliente Exemplo Atualizado LTDA",
    "tradeName": "Cliente Atualizado",
    "document": "12.345.678/0001-90",
    "industry": "Tecnologia",
    "website": "https://clienteatualizado.com.br",
    "notes": "Dados atualizados no cadastro do cliente.",
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T11:00:00.000Z"
  }
}
```

Resposta quando nao encontrada:

```json
{
  "error": {
    "message": "Company not found",
    "code": "COMPANY_NOT_FOUND"
  }
}
```

### DELETE `/companies/:id`

Remove uma empresa por ID, escopada ao usuario admin logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
role = admin obrigatoria
```

Path params:

```txt
id: UUID
```

Resposta esperada:

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerUserId": "user_id",
    "name": "Cliente Exemplo Atualizado LTDA",
    "tradeName": "Cliente Atualizado",
    "document": "12.345.678/0001-90",
    "industry": "Tecnologia",
    "website": "https://clienteatualizado.com.br",
    "notes": "Dados atualizados no cadastro do cliente.",
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T11:00:00.000Z"
  }
}
```

Resposta quando nao encontrada:

```json
{
  "error": {
    "message": "Company not found",
    "code": "COMPANY_NOT_FOUND"
  }
}
```

## Diagnostic Areas

Areas e perguntas compoem o formulario do Diagnostico 360.

### GET `/diagnostic-areas`

Lista areas ativas do diagnostico com suas perguntas ativas.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Resposta esperada:

```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "name": "Marketing",
      "slug": "marketing",
      "description": null,
      "displayOrder": 1,
      "questions": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440000",
          "areaId": "990e8400-e29b-41d4-a716-446655440000",
          "question": "A empresa possui posicionamento claro para seu publico-alvo?",
          "description": "Avalia clareza de proposta de valor, nicho e mensagem.",
          "displayOrder": 1
        }
      ]
    }
  ]
}
```

Use o campo `questions[].id` como `questionId` ao registrar respostas em:

```txt
POST /diagnostics/:id/answers
```

### POST `/diagnostic-areas/:areaId/questions`

Cria uma pergunta em uma area ativa do diagnostico.

Autenticacao:

```txt
Cookie de sessao obrigatorio
role = admin obrigatoria
```

Path params:

```txt
areaId: UUID
```

Body:

```json
{
  "question": "A empresa possui metas comerciais mensais definidas?",
  "description": "Avalia clareza das metas comerciais por periodo.",
  "displayOrder": 4
}
```

Campos obrigatorios:

```txt
question
```

Campos opcionais:

```txt
description
displayOrder
```

Observacoes:

- se `displayOrder` nao for enviado, a API usa a proxima ordem disponivel na area;
- nao e permitido criar duas perguntas com o mesmo texto na mesma area;
- a area precisa existir e estar ativa.

Resposta esperada:

```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "areaId": "990e8400-e29b-41d4-a716-446655440000",
    "question": "A empresa possui metas comerciais mensais definidas?",
    "description": "Avalia clareza das metas comerciais por periodo.",
    "displayOrder": 4,
    "isActive": true
  }
}
```

Erros esperados:

```txt
DIAGNOSTIC_AREA_NOT_FOUND
DIAGNOSTIC_QUESTION_ALREADY_EXISTS
FORBIDDEN
VALIDATION_ERROR
```

## Diagnostics

Diagnosticos representam a aplicacao do Diagnostico 360 em uma empresa.

Modelo atual:

```txt
company 1:N diagnostics
```

Cada diagnostico pertence a uma empresa e registra o usuario que criou o diagnostico em `createdByUserId`.

### POST `/diagnostics`

Cria um diagnostico em status `draft` para uma empresa do usuario logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Body:

```json
{
  "companyId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Diagnostico inicial",
  "notes": "Primeira avaliacao do cliente."
}
```

Campos obrigatorios:

```txt
companyId
```

Campos opcionais:

```txt
title
notes
```

Resposta esperada:

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "createdByUserId": "user_id",
    "title": "Diagnostico inicial",
    "notes": "Primeira avaliacao do cliente.",
    "status": "draft",
    "completedAt": null,
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T10:00:00.000Z"
  }
}
```

Resposta quando a empresa nao existe ou nao pertence ao usuario:

```json
{
  "error": {
    "message": "Company not found",
    "code": "COMPANY_NOT_FOUND"
  }
}
```

### GET `/diagnostics/:id`

Busca um diagnostico por ID, escopado ao usuario logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Path params:

```txt
id: UUID
```

Resposta esperada:

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "createdByUserId": "user_id",
    "title": "Diagnostico inicial",
    "notes": "Primeira avaliacao do cliente.",
    "status": "draft",
    "completedAt": null,
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T10:00:00.000Z"
  }
}
```

Resposta quando nao encontrado:

```json
{
  "error": {
    "message": "Diagnostic not found",
    "code": "DIAGNOSTIC_NOT_FOUND"
  }
}
```

### GET `/companies/:companyId/diagnostics`

Lista os diagnosticos de uma empresa do usuario logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Path params:

```txt
companyId: UUID
```

Resposta esperada:

```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "companyId": "550e8400-e29b-41d4-a716-446655440000",
      "createdByUserId": "user_id",
      "title": "Diagnostico inicial",
      "notes": "Primeira avaliacao do cliente.",
      "status": "draft",
      "completedAt": null,
      "createdAt": "2026-06-24T10:00:00.000Z",
      "updatedAt": "2026-06-24T10:00:00.000Z"
    }
  ]
}
```

### POST `/diagnostics/:id/answers`

Registra a nota de uma pergunta em um diagnostico em andamento.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Path params:

```txt
id: UUID
```

Body:

```json
{
  "questionId": "770e8400-e29b-41d4-a716-446655440000",
  "score": 8,
  "comment": "Processo comercial bem definido, mas ainda sem rotina clara de follow-up."
}
```

Campos obrigatorios:

```txt
questionId
score
```

Campos opcionais:

```txt
comment
```

Regras de validacao:

- `score` deve ser um numero inteiro entre 0 e 10.
- a pergunta precisa existir e estar ativa.
- o diagnostico precisa pertencer a uma empresa do usuario logado.
- o diagnostico precisa estar em status `draft`.
- nao pode existir outra resposta para a mesma pergunta no mesmo diagnostico.

Resposta esperada:

```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "diagnosticId": "660e8400-e29b-41d4-a716-446655440000",
    "questionId": "770e8400-e29b-41d4-a716-446655440000",
    "score": 8,
    "comment": "Processo comercial bem definido, mas ainda sem rotina clara de follow-up.",
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T10:00:00.000Z"
  }
}
```

Erros esperados:

```txt
DIAGNOSTIC_NOT_FOUND
DIAGNOSTIC_ALREADY_COMPLETED
DIAGNOSTIC_QUESTION_NOT_FOUND
DIAGNOSTIC_ANSWER_ALREADY_EXISTS
VALIDATION_ERROR
```

### GET `/diagnostics/:id/answers`

Lista as respostas registradas em um diagnostico do usuario logado.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Path params:

```txt
id: UUID
```

Resposta esperada:

```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "diagnosticId": "660e8400-e29b-41d4-a716-446655440000",
      "questionId": "770e8400-e29b-41d4-a716-446655440000",
      "score": 8,
      "comment": "Processo comercial bem definido.",
      "createdAt": "2026-06-24T10:00:00.000Z",
      "updatedAt": "2026-06-24T10:00:00.000Z",
      "question": {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "areaId": "990e8400-e29b-41d4-a716-446655440000",
        "question": "A empresa possui posicionamento claro para seu publico-alvo?",
        "description": "Avalia clareza de proposta de valor, nicho e mensagem.",
        "displayOrder": 1,
        "area": {
          "id": "990e8400-e29b-41d4-a716-446655440000",
          "name": "Marketing",
          "slug": "marketing",
          "displayOrder": 1
        }
      }
    }
  ]
}
```

### PATCH `/diagnostic-answers/:id`

Atualiza uma resposta de um diagnostico ainda em andamento.

Autenticacao:

```txt
Cookie de sessao obrigatorio
```

Path params:

```txt
id: UUID da resposta
```

Body:

```json
{
  "score": 7,
  "comment": "Comentario revisado pelo consultor."
}
```

Regras:

- envie pelo menos `score` ou `comment`;
- `score` deve ser um numero inteiro entre 0 e 10;
- a resposta precisa pertencer a um diagnostico de uma empresa do usuario logado;
- diagnosticos em status `completed` nao podem ter respostas alteradas.

Resposta esperada:

```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "diagnosticId": "660e8400-e29b-41d4-a716-446655440000",
    "questionId": "770e8400-e29b-41d4-a716-446655440000",
    "score": 7,
    "comment": "Comentario revisado pelo consultor.",
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T10:10:00.000Z"
  }
}
```

Erros esperados:

```txt
DIAGNOSTIC_ANSWER_NOT_FOUND
DIAGNOSTIC_ALREADY_COMPLETED
VALIDATION_ERROR
```

## Fluxo de Teste no Insomnia

Crie um environment com:

```json
{
  "base_url": "http://localhost:3333"
}
```

Ordem recomendada das requisicoes:

```txt
1. GET  {{ base_url }}/health
2. POST {{ base_url }}/api/auth/sign-up/email
3. POST {{ base_url }}/api/auth/sign-in/email
4. GET  {{ base_url }}/users/me
5. POST {{ base_url }}/companies
6. GET  {{ base_url }}/companies
7. GET  {{ base_url }}/companies/:id
8. PATCH {{ base_url }}/companies/:id
9. DELETE {{ base_url }}/companies/:id
10. GET  {{ base_url }}/diagnostic-areas
11. POST {{ base_url }}/diagnostic-areas/:areaId/questions
12. POST {{ base_url }}/diagnostics
13. GET  {{ base_url }}/diagnostics/:id
14. GET  {{ base_url }}/companies/:companyId/diagnostics
15. POST {{ base_url }}/diagnostics/:id/answers
16. GET  {{ base_url }}/diagnostics/:id/answers
17. PATCH {{ base_url }}/diagnostic-answers/:id
18. POST {{ base_url }}/auth/sign-out
19. GET  {{ base_url }}/users/me
```

Checklist de cookies:

- Mantenha a cookie jar do Insomnia habilitada.
- Faca login antes de chamar rotas autenticadas.
- Chame `/users/me` depois do login para confirmar que a sessao esta ativa.
- Nao adicione headers `ownerUserId`, `userId` ou `role`.

Headers recomendados para requisicoes JSON:

```txt
Content-Type: application/json
Accept: application/json
```

## Erros Comuns

### `UNAUTHORIZED`

A requisicao nao possui cookie de sessao valido.

Como resolver:

```txt
Faca login novamente e confirme que o Insomnia esta enviando o cookie salvo.
```

### `FORBIDDEN`

O usuario autenticado nao possui permissao para executar a acao.

Caso atual:

```txt
POST /companies exige role = admin.
```

### `VALIDATION_ERROR`

O body ou os params falharam na validacao Zod.

Causas comuns:

- `name` ausente ao criar empresa;
- body vazio ao atualizar empresa;
- `website` invalido;
- UUID invalido em rotas com `:id` ou `:companyId`.

### `COMPANY_NOT_FOUND`

A empresa nao existe ou nao pertence ao usuario autenticado.

### `DIAGNOSTIC_NOT_FOUND`

O diagnostico nao existe ou pertence a uma empresa de outro usuario.

### `ROUTE_NOT_FOUND`

A rota ou o metodo HTTP nao existem na API.

## Planejadas, Mas Ainda Nao Implementadas

Estas rotas fazem parte da especificacao do produto, mas ainda nao foram implementadas:

```txt
POST   /diagnostics/:id/complete
GET    /diagnostics/:id/scores
GET    /companies/:companyId/dashboard
POST   /action-plans
GET    /companies/:companyId/action-plans
PATCH  /action-plans/:id
PATCH  /action-plans/:id/status
POST   /diagnostics/:id/ai-summary
POST   /reports/diagnostic/:diagnosticId/pdf
POST   /reports/diagnostic/:diagnosticId/excel
```
