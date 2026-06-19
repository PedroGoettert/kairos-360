# AGENTS.md — Diagnóstico 360

## Project overview

This repository contains the Diagnóstico 360 platform, an internal business diagnostic system for Kairos.

The product helps consultants:

- Register companies and clients.
- Apply a 360° business diagnostic.
- Calculate scores by area.
- Identify bottlenecks.
- Manage leads in a CRM.
- Track campaigns and creatives.
- Generate action plans.
- Generate reports.
- Use AI to interpret business data and suggest recommendations.

Main business flow:

Lead enters → Kairos registers the company → Consultant applies Diagnóstico 360 → System calculates scores → Dashboard displays bottlenecks → AI generates an executive diagnosis → Consultant creates action plans → Reports are generated.

## Repository structure

Expected structure:

```txt
diagnostico-360/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── docs/
├── .clinerules/
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

## Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Recharts

### Backend

- Node.js 24
- Fastify
- TypeScript
- Drizzle ORM
- PostgreSQL
- Better Auth
- Zod

### Shared package

Use `packages/shared` for:

- Shared Zod schemas.
- Shared types.
- Shared constants.
- Shared enums.

### Database

Use PostgreSQL with Drizzle ORM and drizzle-kit.

Do not use Prisma.

### Package manager

Use pnpm. Do not use npm or yarn.

## Main commands

From the repository root:

```bash
pnpm install
pnpm dev:web
pnpm dev:api
pnpm build
pnpm lint
docker compose up -d
```

Inside `apps/api`:

```bash
pnpm dev
pnpm build
pnpm start
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

Inside `apps/web`:

```bash
pnpm dev
pnpm build
pnpm lint
```

## Development rules

Before changing files:

1. Understand the affected module.
2. Check existing schemas.
3. Check existing types.
4. Check existing routes.
5. Avoid duplicated logic.
6. Explain the implementation plan when the task is large.
7. Avoid changing unrelated files.

After changing files:

1. List all changed files.
2. Explain what changed.
3. Mention required commands.
4. Suggest a commit message.
5. Do not run `git push` unless explicitly requested.

## TypeScript rules

Use strict TypeScript.

API must use:

- ESM.
- `type: "module"`.
- `@tsconfig/node24`.
- Module resolution compatible with Node 24.
- No `any`.

Prefer:

```ts
import { FastifyInstance } from "fastify";
```

Avoid:

```ts
const fastify = require("fastify");
```

## Backend architecture

Backend modules must follow:

```txt
apps/api/src/modules/<module>/
├── <module>.routes.ts
├── <module>.controller.ts
├── <module>.service.ts
├── <module>.schemas.ts
└── <module>.types.ts
```

Responsibilities:

- Routes register endpoints and middlewares.
- Controllers handle request/response.
- Services contain business rules.
- Schemas contain Zod validation.
- Types are inferred from schemas when possible.

Do not put business logic inside controllers.

## Database rules

Schemas must live in:

```txt
apps/api/src/database/schema/
```

Expected organization:

```txt
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

Avoid generic `export *`.

Prefer named exports:

```ts
export { users } from "./users";
export { companies } from "./companies";
```

When changing database schema:

1. Update Drizzle schema.
2. Generate migration.
3. Review migration.
4. Run migration.
5. Update Zod schemas.
6. Update shared types if needed.
7. Update services/controllers.
8. Update frontend if needed.

Never alter database structure without migration.

## API response pattern

Success:

```json
{
  "data": {}
}
```

List:

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

Error:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Frontend rules

Use feature-based organization:

```txt
apps/web/src/features/
├── companies/
├── diagnostics/
├── dashboard/
├── crm/
├── action-plans/
├── reports/
└── ai/
```

Each feature may contain:

```txt
components/
hooks/
services/
schemas/
types/
```

Forms must use React Hook Form, Zod and zodResolver.

Every async screen must handle loading, error, empty state and success.

## Business rules

The system is multi-company. Every relevant business record must be linked to a company.

Default diagnostic areas:

- Marketing
- Comercial
- Operação
- Financeiro
- Gestão
- Atendimento
- Recursos Humanos

Diagnostic answers use a score from 0 to 10.

Area score: average of answers in the area.

General score: average of area scores.

Health classification:

```txt
0 to 4.9   = critical
5 to 7.4   = attention
7.5 to 10  = healthy
```

Main bottleneck: area with the lowest score.

Second priority: area with the second lowest score.

CRM pipeline:

```txt
lead
diagnostic
meeting
proposal
closed
implementation
lost
```

Every CRM stage change must create a history entry.

Action plan statuses:

```txt
not_started
in_progress
completed
```

## AI rules

AI must interpret system data. AI must not invent metrics.

Backend calculates numbers. AI explains and recommends based on the numbers.

AI inputs may include diagnostic scores, diagnostic answers, consultant comments, CRM data, campaign data and conversion data.

AI outputs may include executive summary, main bottleneck, second priority, probable cause, risks, recommendations and suggested action plans.

Prefer structured JSON responses.

All AI outputs must be reviewable by a consultant before final use in reports.

## Git rules

Use Conventional Commits.

Allowed examples:

```txt
feat(companies): create companies module
feat(diagnostics): implement diagnostic scoring
fix(auth): correct session validation
refactor(crm): simplify lead service
docs(project): update architecture documentation
chore(database): add drizzle config
```

Never run without explicit user approval:

```bash
git push
git push --force
git reset --hard
git rebase
```

Before committing:

1. Show changed files.
2. Explain changes.
3. Suggest commit message.
4. Ask for approval.

## Priority order

Implement in this order:

1. Monorepo setup
2. Docker Compose
3. PostgreSQL
4. API base
5. Web base
6. Shared package
7. Drizzle
8. Better Auth
9. Users
10. Companies
11. Diagnostic 360
12. Scoring
13. Dashboard
14. Action plans
15. AI diagnostic summary
16. Reports
17. CRM
18. Meta Ads
19. WhatsApp

Do not start external integrations before the core system is working.

## Documentation routing

Use these docs when deeper context is needed:

- `docs/architecture.md`
- `docs/database.md`
- `docs/api-patterns.md`
- `docs/frontend-patterns.md`
- `docs/business-rules.md`
- `docs/ai-rules.md`
- `docs/git-workflow.md`

When information conflicts, prefer this order:

1. User’s latest instruction.
2. `AGENTS.md`.
3. More specific docs inside `docs/`.
4. Existing code conventions.
