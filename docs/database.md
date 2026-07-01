# Banco, Schemas e Sincronizacao - Kairos 360

## ORM oficial

Usar Drizzle ORM com PostgreSQL.

Nao usar Prisma.

## Local dos schemas

```txt
apps/api/src/database/schema/
```

## Organizacao alvo dos schemas

```txt
schema/
  auth.ts
  organizations.ts
  organization-users.ts
  diagnostic-templates.ts
  diagnostic-template-areas.ts
  diagnostic-template-questions.ts
  organization-diagnostic-areas.ts
  organization-diagnostic-questions.ts
  baseline-diagnostics.ts
  baseline-diagnostic-answers.ts
  baseline-diagnostic-scores.ts
  manual-metrics.ts
  data-sources.ts
  data-ingestion-logs.ts
  business-events.ts
  metrics-history.ts
  business-signals.ts
  alerts.ts
  insights.ts
  action-plans.ts
  reports.ts
  index.ts
```

## Descricao dos schemas

### Nucleo do sistema

| Schema | Descricao |
|---|---|
| `organizations` | empresa assinante do SaaS |
| `organization-users` | vinculo entre usuarios e organizacao, com papel e status |

### Baseline manual

| Schema | Descricao |
|---|---|
| `diagnostic-templates` | templates globais de baseline |
| `diagnostic-template-areas` | areas do template |
| `diagnostic-template-questions` | perguntas do template |
| `organization-diagnostic-areas` | copia editavel das areas para a organizacao |
| `organization-diagnostic-questions` | copia editavel das perguntas para a organizacao |
| `baseline-diagnostics` | diagnosticos manuais da organizacao |
| `baseline-diagnostic-answers` | respostas do baseline |
| `baseline-diagnostic-scores` | scores calculados do baseline |

### Operacao manual antes das integracoes

| Schema | Descricao |
|---|---|
| `manual-metrics` | indicadores registrados manualmente pela organizacao |

### Dados continuos

| Schema | Descricao |
|---|---|
| `data-sources` | futuras fontes conectadas por organizacao |
| `data-ingestion-logs` | auditoria de sincronizacoes e ingestao |
| `business-events` | eventos normalizados |
| `metrics-history` | serie temporal das metricas |
| `business-signals` | sinais derivados |
| `alerts` | alertas operacionais |
| `insights` | insights por regras ou IA |

### Operacao

| Schema | Descricao |
|---|---|
| `action-plans` | planos de acao da propria organizacao |
| `reports` | relatorios gerados |

## Estado atual do repositorio

Hoje o codigo ainda possui estruturas legadas como:

- `companies`
- `company_diagnostic_areas`
- `company_diagnostic_questions`
- `diagnostics`
- `diagnostic_answers`
- `diagnostic_scores`

Essas estruturas devem ser tratadas como **legado transitorio**.
Na refatoracao completa, a direcao correta e migrar para o dominio de `organizations`.

Nao adicionar novas tabelas reforcando o conceito antigo de carteira de clientes.
Nao adicionar novas colunas, foreign keys, indices ou joins baseados em `company_id`.

Ja implementado no dominio novo:

- `organizations`
- `organization_users`

## Regra de modelagem

Nao modelar o banco para hiperflexibilidade desnecessaria.

Preferir:

- estruturas opinadas
- enums e categorias claras
- relacionamentos simples
- extensibilidade controlada

Evitar:

- engines genericas demais
- customizacao irrestrita por tenant
- modelagem orientada a consultoria multi-cliente

## Regra de congelamento do legado

Para o MVP, `organizations` e o dominio oficial do banco.

`companies` e estruturas associadas devem ser mantidas apenas para compatibilidade temporaria.

Nao criar novos:

- schemas orientados a `companies`
- campos `company_id` em tabelas novas
- relacionamentos novos apontando para `companies`
- migrations cujo objetivo seja expandir o dominio legado

## Regra de exportacao

Evitar `export *`.

Preferir exports nomeados no `index.ts`.

Exemplo:

```ts
export { organizations } from "./organizations";
export { businessEvents } from "./business-events";
export { reports } from "./reports";
```

## Fluxo obrigatorio ao alterar banco

Sempre que alterar schema Drizzle:

1. Alterar arquivo em `apps/api/src/database/schema`.
2. Rodar geracao de migration.
3. Conferir migration gerada.
4. Rodar migration.
5. Atualizar schemas Zod se necessario.
6. Atualizar types compartilhados se necessario.
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

## Decisao de refatoracao

Opcao escolhida:

```txt
Opcao B - refatoracao estrutural completa do dominio
```

Isso significa:

- o modelo atual de `companies` nao e mais o modelo alvo
- o produto passa a girar em torno da organizacao dona da conta
- o baseline manual permanece
- metricas manuais entram antes das integracoes

## O que ja existe no banco

Hoje o repositorio ja possui:

- auth
- companies (legado)
- diagnostico manual legado
- organizations
- organization_users
- action plans
- reports

## O que ainda precisa existir no banco

- organizations
- organization_users
- manual_metrics
- depois data_sources
- data_ingestion_logs
- business_events
- metrics_history
- business_signals
- alerts
- insights
