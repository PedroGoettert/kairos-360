# Banco, Schemas e Sincronização

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
  diagnostic-areas.ts
  diagnostic-questions.ts
  diagnostics.ts
  diagnostic-answers.ts
  diagnostic-scores.ts
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

## Regra de exportação

Evitar `export *`.

Preferir exports nomeados no `index.ts`.

Exemplo:

```ts
export { users } from './users';
export { companies } from './companies';
export { diagnostics } from './diagnostics';
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
