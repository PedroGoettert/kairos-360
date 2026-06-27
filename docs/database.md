# Banco, Schemas e Sincronização — Kairos 360

## ORM oficial

Usar Drizzle ORM com PostgreSQL.

Não usar Prisma.

## Local dos schemas

```txt
apps/api/src/database/schema/
```

## Organização dos schemas

```txt
schema/
  users.ts
  companies.ts
  diagnostic-templates.ts
  diagnostic-template-areas.ts
  diagnostic-template-questions.ts
  company-diagnostic-areas.ts
  company-diagnostic-questions.ts
  diagnostics.ts
  diagnostic-answers.ts
  diagnostic-scores.ts
  data-sources.ts
  data-ingestion-logs.ts
  business-events.ts
  business-signals.ts
  alerts.ts
  insights.ts
  metrics-history.ts
  leads.ts
  lead-notes.ts
  lead-tasks.ts
  campaigns.ts
  creatives.ts
  action-plans.ts
  reports.ts
  ai-outputs.ts
  index.ts
```

## Descrição dos schemas

### Núcleo do sistema

| Schema | Descrição |
|---|---|
| `users` | Usuários do sistema (admin, consultant, viewer) |
| `companies` | Empresas clientes, vinculadas a um owner_user_id |

### Diagnóstico Manual (Baseline)

| Schema | Descrição |
|---|---|
| `diagnostic-templates` | Templates globais de diagnóstico (criados por admin) |
| `diagnostic-template-areas` | Áreas dentro de um template |
| `diagnostic-template-questions` | Perguntas dentro de uma área do template |
| `company-diagnostic-areas` | Cópia editável das áreas do template para uma empresa |
| `company-diagnostic-questions` | Cópia editável das perguntas para uma empresa |
| `diagnostics` | Diagnósticos realizados em uma empresa |
| `diagnostic-answers` | Respostas do diagnóstico, vinculadas às perguntas da empresa |
| `diagnostic-scores` | Scores calculados por área e geral do diagnóstico |

### Ingestão e Processamento Contínuo

| Schema | Descrição |
|---|---|
| `data-sources` | Fontes de dados configuradas por empresa (Meta Ads, WhatsApp, CRM, etc.) |
| `data-ingestion-logs` | Log de cada tentativa de ingestão (webhook recebido, scheduler executado, etc.) |
| `business-events` | Eventos de negócio normalizados provenientes das fontes de dados |
| `business-signals` | Sinais derivados de eventos e métricas |
| `alerts` | Alertas disparados quando sinais ultrapassam thresholds |
| `insights` | Insights gerados por regras ou IA |
| `metrics-history` | Série temporal de métricas calculadas |

### CRM

| Schema | Descrição |
|---|---|
| `leads` | Leads no pipeline de CRM |
| `lead-notes` | Notas associadas a um lead |
| `lead-tasks` | Tarefas associadas a um lead |

### Campanhas e Criativos

| Schema | Descrição |
|---|---|
| `campaigns` | Campanhas de marketing |
| `creatives` | Criativos (anúncios, peças) vinculados a campanhas |

### Planos de Ação

| Schema | Descrição |
|---|---|
| `action-plans` | Planos de ação vinculados a uma empresa |

### Relatórios e IA

| Schema | Descrição |
|---|---|
| `reports` | Relatórios gerados (PDF, Excel) |
| `ai-outputs` | Saídas da IA (resumo executivo, recomendações, etc.) |

## Regra de exportação

Evitar `export *`.

Preferir exports nomeados no `index.ts`.

Exemplo:

```ts
export { users } from './users';
export { companies } from './companies';
export { diagnostics } from './diagnostics';
export { dataSources } from './data-sources';
export { businessEvents } from './business-events';
export { businessSignals } from './business-signals';
export { alerts } from './alerts';
export { insights } from './insights';
export { metricsHistory } from './metrics-history';
```

## Fluxo obrigatório ao alterar banco

Sempre que alterar schema Drizzle:

1. Alterar arquivo em `apps/api/src/database/schema`.
2. Rodar geração de migration.
3. Conferir migration gerada.
4. Rodar migration.
5. Atualizar schemas Zod se necessário.
6. Atualizar types compartilhados se necessário.
7. Atualizar services/controllers impactados.
8. Testar endpoint relacionado.

## Comandos

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

## Regras importantes

- Nunca alterar tabela diretamente sem migration.
- Nunca remover coluna sem avaliar impacto.
- Sempre usar UUID como ID principal.
- Sempre criar `created_at` e `updated_at` nas tabelas principais.
- Sempre modelar relacionamentos com foreign key.
- Sempre usar enum para status importantes.

## Estado implementado (junho de 2026)

Os schemas atualmente exportados pela aplicação são:

```txt
auth (user, session, account, verification e user_role)
companies
diagnostic_templates
diagnostic_template_areas
diagnostic_template_questions
company_diagnostic_areas
company_diagnostic_questions
diagnostics
diagnostic_answers
diagnostic_scores
action_plans
reports
```

As migrations versionadas vão de `0000_broad_peter_quill.sql` até
`0004_aberrant_malcolm_colcord.sql`.

### Planos de ação

- Pertencem a uma empresa e ao usuário criador.
- Podem referenciar um diagnóstico e uma área da empresa.
- Status: `not_started`, `in_progress` ou `completed`.

### Relatórios

- Pertencem a uma empresa e ao usuário criador.
- O tipo implementado é `manual_diagnostic`.
- Os formatos registrados são `pdf` e `excel`.
- A implementação atual persiste um snapshot estruturado em JSON; a materialização do arquivo
  binário fica para o frontend ou para um worker futuro.

Os schemas de diagnóstico contínuo listados anteriormente são o modelo alvo e ainda não foram
criados no banco.
