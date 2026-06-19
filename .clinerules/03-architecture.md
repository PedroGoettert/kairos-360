# Arquitetura do Projeto

O projeto deve seguir arquitetura modular em monorepo.

## Estrutura recomendada

```txt
apps/
  web/
    src/
      app/
      components/
      features/
      lib/
      services/
      types/

  api/
    src/
      modules/
        auth/
        users/
        companies/
        diagnostics/
        dashboard/
        crm/
        campaigns/
        creatives/
        action-plans/
        reports/
        ai/
        integrations/
      database/
        schema/
      plugins/
      config/
      server.ts

packages/
  shared/
    src/
      schemas/
      types/
      constants/

docs/
```

## Regra de módulos no backend

Cada módulo deve seguir este padrão:

```txt
module-name/
  module.routes.ts
  module.controller.ts
  module.service.ts
  module.schemas.ts
  module.types.ts
```

Exemplo:

```txt
diagnostics/
  diagnostics.routes.ts
  diagnostics.controller.ts
  diagnostics.service.ts
  diagnostics.schemas.ts
  diagnostics.types.ts
```

## Responsabilidades

Routes:

- Registrar endpoints.
- Aplicar middlewares.
- Conectar rota ao controller.

Controller:

- Receber request.
- Validar params/body/query.
- Chamar service.
- Retornar response.

Service:

- Aplicar regra de negócio.
- Consultar banco.
- Calcular scores.
- Integrar APIs externas.

Schemas:

- Zod schemas de entrada e saída.

Types:

- Tipos derivados dos schemas.

Não colocar regra de negócio no controller.
