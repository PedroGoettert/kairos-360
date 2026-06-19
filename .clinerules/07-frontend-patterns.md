# Padrões de Frontend

## Framework

Usar Next.js com TypeScript.

## UI

Usar shadcn/ui como base.

## Organização

```txt
features/
  companies/
  diagnostics/
  dashboard/
  crm/
  action-plans/
  reports/
  ai/
```

Cada feature pode ter:

```txt
components/
hooks/
services/
schemas/
types/
```

## Formulários

Usar:

- React Hook Form
- Zod
- zodResolver

## Chamadas HTTP

Centralizar chamadas em services.

Exemplo:

```txt
features/companies/services/company-service.ts
```

## Estados de tela

Toda tela com dados assíncronos deve tratar:

- loading
- error
- empty state
- success

## Dashboard

Usar cards, gráficos e semáforo.

Classificação:

- 0 a 4.9 = crítico
- 5 a 7.4 = atenção
- 7.5 a 10 = saudável

## Rotas principais

```txt
/login
/dashboard
/clientes
/clientes/:id
/clientes/:id/diagnosticos
/clientes/:id/dashboard
/clientes/:id/planos-de-acao
/crm
/crm/:leadId
/campanhas
/criativos
/relatorios
/configuracoes/diagnostico
/configuracoes/usuarios
```
