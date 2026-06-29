# AGENTS.md - Kairos 360

## Mandatory Reading

Before making any change, read:

- docs/architecture.md
- docs/database.md
- docs/api-patterns.md
- docs/frontend-patterns.md
- docs/business-rules.md
- docs/ai-rules.md
- docs/git-workflow.md

These documents are considered part of the project specification.

## Project overview

This repository contains the **Kairos 360** platform, a **SaaS de diagnostico continuo da saude empresarial**.

The product is meant to be used by the company that subscribes to it in order to monitor **its own operation**.
It is **not** a consultancy backoffice for Kairos to manage external client companies.

The product helps an organization:

- Establish an initial **baseline** through a manual 360 diagnostic.
- Register manual operational data while integrations do not exist yet.
- Monitor its own health by area.
- Identify bottlenecks and priorities.
- Manage internal action plans.
- Generate internal reports.
- Later connect CRM, WhatsApp, Meta Ads, Facebook and other sources.
- Interpret business data with AI after the backend has calculated the numbers.

## Product stance

The product should be **opinionated**.

Do not over-engineer generic configurability as if this were a consultancy framework builder.

Prefer:

- strong default baseline areas
- strong default questions
- strong default dashboards
- controlled extensions

Allow only **controlled flexibility**, such as:

- editing text
- activating or deactivating items
- reordering
- adding a limited number of organization-specific items when necessary

Avoid turning core modules into highly generic template engines unless the product truly requires it.

Main business flow:

```txt
Organization signs up -> users access the tenant -> baseline manual diagnostic is applied
-> initial scores are calculated -> manual metrics or data-source connections are configured
-> business events and metrics are recorded -> signals and alerts are derived
-> dashboard shows health, bottlenecks and priorities -> action plans are managed
-> reports and AI summaries are generated
```

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

### Domain direction

The target domain is:

- one organization or tenant per account
- users belong to the same organization
- the system monitors the organization's own health
- diagnostic manual is a baseline, not the product core
- manual metrics are part of the MVP before integrations
- flexibility should be controlled, not unlimited

Do not expand the old "client portfolio" model.

If existing code still uses `companies`, treat it as **legacy transitional naming**.
New architecture work should move toward `organizations` or equivalent tenant naming.

### Additional modules

These modules are expected in the new product direction:

| Module | Purpose |
|---|---|
| `organizations` | tenant / organization management |
| `organization-users` | membership, access and roles |
| `baseline-diagnostics` | manual initial diagnostic |
| `manual-metrics` | manual data entry before integrations |
| `data-sources` | source configuration and connection status |
| `data-ingestion` | ingestion logs, schedulers and normalizers |
| `business-events` | normalized events |
| `metrics-history` | time-series metrics |
| `business-signals` | derived signals |
| `alerts` | alert triggering and lifecycle |
| `insights` | AI + rules interpretation layer |
| `action-plans` | operational response to bottlenecks |
| `reports` | generated reports |

## Database rules

Schemas must live in:

```txt
apps/api/src/database/schema/
```

Expected target organization:

```txt
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

Avoid generic `export *`.

Prefer named exports:

```ts
export { organizations } from "./organizations";
export { reports } from "./reports";
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
├── auth/
├── organization/
├── baseline-diagnostics/
├── dashboard/
├── manual-metrics/
├── data-sources/
├── signals/
├── alerts/
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

The system is multi-tenant, but not a consultancy client-manager.
Every relevant business record must be linked to the current organization.

The baseline manual diagnostic continues to exist.
Manual metrics entry is allowed before external integrations.
AI must interpret data already calculated by the backend.

## Current state

What is already implemented in code:

- auth and session
- current user route
- legacy `companies` module
- legacy baseline structure by company
- legacy diagnostic scoring
- dashboard
- action plans
- reports

What is still missing for the target backend:

- organization domain refactor
- organization users / memberships
- new roles
- manual metrics
- target organization routes
- refactor of legacy baseline naming
- future data-source pipeline

## Git rules

Use Conventional Commits.

Allowed examples:

```txt
feat(organizations): create tenant module
feat(baseline): implement baseline scoring
feat(manual-metrics): add manual metrics entry
fix(auth): correct session validation
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
9. Organization domain refactor
10. Baseline diagnostic as optional manual baseline
11. Manual metrics
12. Dashboard consolidation for organization
13. Action plans aligned to organization domain
14. Reports aligned to organization domain
15. AI summary on real system data
16. Data sources
17. Data ingestion
18. Business events
19. Metrics history
20. Business signals
21. Alerts
22. Insights engine
23. CRM connector
24. Meta Ads connector
25. WhatsApp connector

Real-time processing is a future evolution, not an MVP requirement.

Do not start external integrations before the internal manual and event layers are working.

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

1. User's latest instruction.
2. `AGENTS.md`.
3. More specific docs inside `docs/`.
4. Existing code conventions.
