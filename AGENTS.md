# AGENTS.md — Kairos 360

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

This repository contains the **Kairos 360** platform, a **SaaS de diagnóstico contínuo da saúde empresarial** for Kairos.

The product helps consultants and businesses:

- Establish a **baseline** via manual 360° diagnostic questionnaire.
- **Ingest data continuously** from CRM, WhatsApp, Meta Ads, Facebook, customer service, sales, finance, and other sources.
- Process raw data into **business events**, **business metrics**, **business signals**, and **insights**.
- Calculate and track **health scores** that evolve over time — not just snapshots.
- Identify **bottlenecks** and **trends** through continuous data analysis.
- Trigger **alerts** when signals indicate risk or opportunity.
- Use **AI as an interpretation layer** to explain what the numbers mean.
- Manage leads in a CRM.
- Track campaigns and creatives.
- Generate action plans.
- Generate reports.

Main business flow:

```
Lead enters → Kairos registers the company → Consultant applies baseline 360° diagnostic
→ System calculates initial scores → Data sources connect (CRM, WhatsApp, Meta Ads, etc.)
→ Data ingestion runs continuously → Business events are normalized
→ Metrics are calculated → Signals are derived → AI interprets signals
→ Dashboard displays health, trends, bottlenecks, and alerts
→ Consultant creates action plans → Reports are generated
```

## Repository structure

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

### Additional modules (beyond the core MVP)

As the product evolves toward continuous diagnostics, these modules will be added:

| Module | Purpose |
|---|---|
| `data-ingestion` | Webhooks, schedulers, normalizers for external data sources |
| `business-events` | Normalized event store (every external interaction becomes an event) |
| `business-signals` | Signal derivation from events and metrics |
| `business-alerts` | Alert rules, triggering, acknowledgement |
| `insights` | AI-generated and rule-based insights |
| `data-sources` | Source configuration, tokens, status per company |

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
├── ai/
├── signals/
├── alerts/
├── insights/
└── data-sources/
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

### Baseline Diagnostic (manual questionnaire)

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

### Continuous Diagnostics

Beyond the baseline, scores are continuously updated from:

- Business events (sales closed, support tickets, campaign results, etc.)
- Derived metrics (conversion rate, average ticket, NPS, response time, etc.)
- Business signals (trend deviations, anomalies, thresholds exceeded)

The system maintains:

- **Current score**: weighted combination of baseline + metric evidence.
- **Score history**: time-series of all score changes.
- **Score trend**: direction (improving, stable, declining).

### Signals and Alerts

A **signal** is a derived indicator from one or more metrics. Examples:

- `conversion_rate_dropped`: conversion rate fell > 15% in 30 days.
- `support_volume_spike`: ticket volume > 2σ above mean.
- `campaign_roi_declining`: ROI declining for 2 consecutive months.

An **alert** is a signal that crossed a notification threshold.

Alerts have statuses:

```txt
active
acknowledged
resolved
```

### AI interpretation layer

AI must interpret system data. AI must not invent metrics.

Backend calculates numbers. AI explains and recommends based on the numbers.

AI inputs may include diagnostic scores, diagnostic answers, consultant comments, CRM data, campaign data, conversion data, business signals, alerts, and metric history.

AI outputs may include executive summary, main bottleneck, second priority, probable cause, risks, recommendations, suggested action plans, and signal interpretation.

Prefer structured JSON responses.

All AI outputs must be reviewable by a consultant before final use in reports.

## Git rules

Use Conventional Commits.

Allowed examples:

```txt
feat(companies): create companies module
feat(diagnostics): implement diagnostic scoring
feat(data-ingestion): add whatsapp webhook handler
feat(signals): implement conversion rate signal derivation
feat(alerts): add alert triggering engine
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
11. Baseline Diagnostic 360 (manual questionnaire)
12. Scoring engine
13. Dashboard
14. Action plans
15. AI diagnostic summary
16. Reports
17. Data sources (configuration layer)
18. Data ingestion (webhooks, schedulers)
19. Business events (normalization layer)
20. Business signals (derivation engine)
21. Alerts (triggering and notification)
22. Insights engine (rule-based + AI)
23. CRM
24. Meta Ads (as data source)
25. WhatsApp (as data source)

**Real-time processing is a future evolution, not an MVP requirement.**

Do not start external integrations before the core data ingestion and signal layers are working.

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