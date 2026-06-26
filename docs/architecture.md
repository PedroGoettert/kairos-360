# Arquitetura do Projeto — Kairos 360

O projeto deve seguir arquitetura modular em monorepo.

## Visão geral da arquitetura

O Kairos 360 é um SaaS de diagnóstico contínuo da saúde empresarial. A arquitetura reflete o fluxo de dados desde fontes externas até insights acionáveis:

```
Fontes externas (CRM, WhatsApp, Meta Ads, ERP, etc.)
       ↓
Data Sources (configuração, autenticação, status por empresa)
       ↓
Data Ingestion (webhooks, schedulers, normalizadores)
       ↓
Business Events (eventos normalizados — toda interação externa vira um evento)
       ↓
Business Metrics (cálculo de métricas: conversão, ticket médio, NPS, etc.)
       ↓
Business Signals (derivação de sinais a partir de eventos e métricas)
       ↓
Alerts (gatilhos quando sinais ultrapassam thresholds)
       ↓
Insights Engine (regras + IA como camada interpretativa)
       ↓
Dashboard / Reports / Action Plans
```

## Diagnóstico manual como baseline

O diagnóstico manual (questionário 360°) continua existindo e serve como **baseline inicial** para empresas que ainda não possuem fontes de dados conectadas. Ele é uma das entradas para o cálculo de score, mas não a única.

À medida que fontes de dados são conectadas, os scores passam a refletir dados reais e contínuos.

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
        data-ingestion/
        business-events/
        business-signals/
        business-alerts/
        insights/
        data-sources/
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

## Camadas arquiteturais

### 1. Data Sources (fontes de dados)

Camada de configuração que armazena:

- Quais fontes estão conectadas por empresa (CRM, WhatsApp, Meta Ads, etc.)
- Tokens de autenticação
- Status da conexão (connected, disconnected, error)
- Metadados de sincronização

### 2. Data Ingestion (ingestão de dados)

Camada responsável por receber dados brutos de fontes externas:

- **Webhooks**: recebimento em tempo real (futuro) ou quase tempo real de eventos
- **Schedulers**: coleta periódica via polling de APIs externas
- **Normalizadores**: transformação de dados brutos em formato padronizado

Para o MVP, a ingestão será **batch/scheduled**, não real-time.

### 3. Business Events (eventos de negócio)

Camada de normalização que transforma dados brutos em eventos de negócio padronizados.

Exemplos de eventos:

- `lead_created`
- `deal_won`
- `support_ticket_opened`
- `campaign_click`
- `whatsapp_message_received`

Cada evento possui:

- `company_id`
- `event_type`
- `source` (qual data source gerou)
- `payload` (dados específicos do evento)
- `timestamp`

### 4. Business Metrics (métricas de negócio)

Camada que calcula métricas a partir dos eventos.

Exemplos:

- Taxa de conversão de leads
- Ticket médio
- NPS derivado de interações
- Taxa de resposta do atendimento
- ROI de campanhas

Métricas são armazenadas como série temporal (`metrics_history`) para análise de tendência.

### 5. Business Signals (sinais de negócio)

Camada que deriva sinais a partir de eventos e métricas.

Um sinal é um indicador qualitativo derivado. Exemplos:

- `conversion_rate_dropped`: queda > 15% em 30 dias
- `support_volume_spike`: volume de tickets > 2 desvios padrão
- `campaign_roi_declining`: ROI em declínio por 2 meses consecutivos

### 6. Alerts (alertas)

Camada que dispara notificações quando sinais ultrapassam thresholds configuráveis.

Status de alerta:

```txt
active
acknowledged
resolved
```

### 7. Insights Engine (motor de insights)

Camada que combina regras de negócio com IA para gerar interpretações acionáveis.

- **Insights baseados em regras**: disparados automaticamente por combinações de sinais
- **Insights gerados por IA**: interpretação contextual dos números do sistema

A IA atua como **camada interpretativa**: ela não calcula números, apenas explica e recomenda com base nos dados processados pelo backend.

### 8. IA como camada interpretativa

A IA recebe dados calculados pelo sistema (scores, métricas, sinais, eventos) e produz:

- Resumo executivo
- Principal gargalo
- Segunda prioridade
- Causa provável
- Recomendações
- Planos de ação sugeridos
- Interpretação de sinais

A IA **não inventa métricas**. O backend calcula, a IA interpreta.

### 9. Tempo real como evolução futura

Processamento real-time (streaming, filas, websockets) é tratado como **evolução futura**.

No MVP, a ingestão e o processamento de dados ocorrem em **batch agendado** (ex: a cada N minutos/horas) ou **sob demanda** (ex: webhook com processamento síncrono).

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
- Derivar sinais.
- Disparar alertas.
- Integrar APIs externas (data sources).

Schemas:

- Zod schemas de entrada e saída.

Types:

- Tipos derivados dos schemas.

Não colocar regra de negócio no controller.