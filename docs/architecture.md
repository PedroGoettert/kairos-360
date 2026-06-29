# Arquitetura do Projeto - Kairos 360

O projeto deve seguir arquitetura modular em monorepo.

## Visao geral da arquitetura

O Kairos 360 e um SaaS de diagnostico continuo da saude empresarial para a **propria empresa assinante**.
O sistema nao existe para Kairos gerenciar uma carteira de empresas-clientes.

Arquitetura alvo:

```txt
Usuarios da organizacao
       ↓
Organization / Tenant
       ↓
Baseline Manual Diagnostic (opcional)
       ↓
Manual Metrics (fase inicial) + Data Sources (fase posterior)
       ↓
Business Events
       ↓
Metrics History
       ↓
Business Signals
       ↓
Alerts
       ↓
Insights Engine (regras + IA)
       ↓
Dashboard / Action Plans / Reports
```

## Principio central

O dominio do produto deve ser:

- uma organizacao monitora a propria operacao
- usuarios pertencem a essa organizacao
- o diagnostico manual e uma baseline inicial
- a operacao pode ser acompanhada manualmente antes das integracoes
- integracoes externas entram depois, sem mudar o modelo central

## Postura de produto

O produto deve ser mais **opinado** do que **generico**.

Isso significa:

- baseline com estrutura padrao forte
- dashboard padrao forte
- metricas manuais com categorias opinadas
- action plans simples

Permitir apenas flexibilidade controlada:

- editar texto
- reordenar
- ativar/desativar
- adicionar item complementar quando realmente necessario

Nao transformar o produto em um construtor altamente flexivel de templates e processos.

## Fases do produto

### Fase 1 - Operacao simples e manual

Antes de CRM, WhatsApp ou Facebook:

- baseline manual por questionario
- cadastro de metricas manuais
- dashboard da propria organizacao
- planos de acao
- relatorios

Nessa fase, o objetivo e resolver o problema com baixo atrito e sem depender de integracoes externas.

Essa fase deve funcionar sozinha.

### Fase 2 - Dados conectados

Depois:

- data sources
- logs de ingestao
- business events
- metrics history automatico
- business signals
- alerts
- insights

## Baseline manual como apoio, nao como centro

O diagnostico manual continua existindo, mas seu papel e:

- inicializar a visao de saude
- servir como fotografia inicial
- complementar a leitura quando ainda nao ha integracoes

Nao tratar o baseline como o centro definitivo do produto.
Tambem nao investir em flexibilidade excessiva nessa camada.

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
        organizations/
        organization-users/
        baseline-diagnostics/
        manual-metrics/
        dashboard/
        action-plans/
        reports/
        data-sources/
        data-ingestion/
        business-events/
        metrics-history/
        business-signals/
        alerts/
        insights/
        ai/
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

## Camadas arquiteturais

### 1. Organization / Tenant

Camada que representa a propria empresa assinante:

- identidade da organizacao
- configuracoes da conta
- usuarios e papeis

### 2. Baseline Manual Diagnostic

Questionario manual opcional para:

- score inicial por area
- classificacao inicial
- gargalo principal

### 3. Manual Metrics

Camada para entrada manual enquanto nao existem integracoes:

- indicadores operacionais
- indicadores comerciais
- indicadores financeiros
- observacoes estruturadas

### 4. Data Sources

Camada de configuracao de futuras integracoes:

- CRM
- WhatsApp
- Meta Ads
- Facebook
- outras fontes

### 5. Data Ingestion

Camada responsavel por:

- registrar importacoes
- normalizar cargas
- auditar erros e sincronizacoes

No MVP, pode ser batch e manual.

### 6. Business Events

Todo dado relevante deve virar evento normalizado.

Exemplos:

- `lead_created`
- `deal_won`
- `invoice_paid`
- `support_ticket_opened`
- `campaign_click`

### 7. Metrics History

Serie temporal das metricas calculadas ou registradas.

Exemplos:

- taxa de conversao
- ticket medio
- faturamento
- tempo medio de resposta

### 8. Business Signals

Sinais derivados de eventos e metricas.

Exemplos:

- queda de conversao
- aumento de tickets
- queda de faturamento
- queda no retorno de campanha

### 9. Alerts

Notificacoes acionaveis quando sinais cruzam thresholds.

Status:

```txt
active
acknowledged
resolved
```

### 10. Insights Engine

Camada que combina:

- regras de negocio
- interpretacao por IA

A IA interpreta, nao calcula.

## Regras de nomenclatura

O dominio alvo deve usar conceitos como:

- `organization`
- `organization_user`
- `baseline_diagnostic`
- `manual_metric`

Se o codigo legado ainda usar `companies`, isso deve ser tratado como estado transitorio.
Nao expandir o modelo legado de carteira de clientes.

## Estado atual reaproveitavel

O que ja existe e pode ser reaproveitado:

- auth
- modelo de session
- baseline manual atual
- score e classificacao
- dashboard atual como base
- action plans
- reports

O que deve ser refatorado:

- `companies` -> `organizations`
- ownership por empresa cliente -> membership da organizacao
- rotas do baseline antigo para rotas do dominio novo

## Tempo real como evolucao futura

Processamento real-time e evolucao futura.

No MVP:

- baseline manual
- metricas manuais
- importacoes pontuais
- processamento batch

ja sao suficientes.

## Regra de modulos no backend

Cada modulo deve seguir este padrao:

```txt
module-name/
  module.routes.ts
  module.controller.ts
  module.service.ts
  module.schemas.ts
  module.types.ts
```

Nao colocar regra de negocio no controller.
