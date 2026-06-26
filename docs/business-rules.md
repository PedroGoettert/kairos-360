# Regras de Negócio — Kairos 360

## Objetivo

A plataforma Kairos 360 é um SaaS de diagnóstico contínuo da saúde empresarial. O sistema deve transformar dados de múltiplas fontes (questionário manual, CRM, WhatsApp, Meta Ads, atendimento, comercial, financeiro) em scores de saúde, sinais, alertas e planos de ação executáveis.

## Multiempresa

O sistema deve ser multiempresa.

Cada cliente possui:

- Diagnósticos (baseline manual)
- Fontes de dados conectadas (data sources)
- Eventos de negócio (business events)
- Métricas históricas (metrics history)
- Sinais (business signals)
- Alertas (alerts)
- Insights
- Dashboard
- Planos de ação
- Relatórios
- Histórico

Todos os dados devem estar vinculados a uma empresa.

## Diagnóstico Manual (Baseline Inicial)

O diagnóstico manual (questionário 360°) é a **baseline inicial** para empresas que ainda não possuem fontes de dados conectadas.

O diagnóstico é composto por áreas.

Áreas padrão:

- Marketing
- Comercial
- Operação
- Financeiro
- Gestão
- Atendimento
- Recursos Humanos

Cada área possui perguntas configuráveis.

Cada pergunta recebe nota de 0 a 10.

À medida que fontes de dados são conectadas e dados reais são ingeridos, os scores passam a refletir uma combinação ponderada da baseline com evidências de dados contínuos.

## Diagnóstico Contínuo

Além da baseline manual, os scores são continuamente atualizados a partir de:

### Business Events (eventos de negócio)

Toda interação com fontes externas é normalizada em um evento de negócio.

Exemplos:

- `lead_created`: novo lead no CRM
- `deal_won`: venda fechada
- `support_ticket_opened`: ticket de suporte aberto
- `campaign_click`: clique em campanha
- `whatsapp_message_received`: mensagem recebida via WhatsApp

### Business Metrics (métricas de negócio)

Métricas são calculadas a partir dos eventos.

Exemplos:

- Taxa de conversão de leads
- Ticket médio
- NPS derivado de interações
- Taxa de resposta do atendimento
- ROI de campanhas
- Frequência de contato com cliente
- Tempo médio de resposta

### Business Signals (sinais de negócio)

Sinais são indicadores qualitativos derivados de métricas e eventos.

Regras de derivação:

- `conversion_rate_dropped`: taxa de conversão caiu > 15% em 30 dias
- `support_volume_spike`: volume de tickets > 2 desvios padrão acima da média
- `campaign_roi_declining`: ROI em declínio por 2 meses consecutivos
- `response_time_increasing`: tempo de resposta aumentando por 3 meses consecutivos
- `lead_volume_drop`: volume de leads caiu > 30% em relação ao mês anterior

## Cálculo de Score

### Baseline (diagnóstico manual)

Score da área = média das respostas da área.

Score geral (baseline) = média dos scores das áreas.

### Score contínuo

O score contínuo combina:

- Baseline manual (peso maior no início, reduz conforme dados são ingeridos)
- Evidências de métricas (peso aumenta conforme mais dados são coletados)
- Sinais (podem ajustar o score para cima ou para baixo)

Score geral = weighted_average(baseline_score, metric_evidence, signal_adjustments)

Score history: série temporal de todas as alterações de score.

Score trend: direção (improving, stable, declining).

## Classificação

```txt
0 até 4.9  = critical / red
5 até 7.4  = attention / yellow
7.5 até 10 = healthy / green
```

## Gargalos

O principal gargalo é a área com menor score.

A segunda prioridade é a segunda área com menor score.

O ranking deve ser ordenado do menor score para o maior.

## Sinais e Alertas

Um **sinal** é um indicador derivado de uma ou mais métricas.

Um **alerta** é um sinal que cruzou um threshold configurado para notificação.

Status de alerta:

```txt
active       = acabou de ser disparado, não tratado
acknowledged = consultor já viu e reconheceu
resolved     = causa foi tratada, sinal voltou ao normal
```

Regras de alerta:

- Todo alerta deve ter um `rule_id` que define a condição de disparo
- Thresholds devem ser configuráveis por empresa
- Alertas resolvidos não devem ser reabertos automaticamente sem novo evento
- O sistema pode agrupar alertas similares para evitar ruído

## Dashboard

Sempre exibir:

- Saúde geral (score geral + classificação)
- Principal gargalo
- Segunda prioridade
- Score trend (melhorando, estável, declinando)
- Últimos sinais e alertas ativos
- Evolução mensal dos scores
- Status dos planos de ação

## CRM

Pipeline padrão:

```txt
lead
diagnostic
meeting
proposal
closed
implementation
lost
```

Toda mudança de etapa deve gerar histórico.

Dados do CRM também alimentam business events (ex: `lead_created`, `deal_won`).

## Plano de Ação

Todo plano deve possuir:

- objetivo
- responsável
- prazo
- status

Status:

```txt
not_started
in_progress
completed
```

Planos de ação podem ser sugeridos pela IA e revisados pelo consultor.

## Relatórios

Tipos:

- Diagnóstico empresarial (baseline + score contínuo)
- Evolução dos indicadores (métricas históricas)
- Performance comercial
- Performance de campanhas
- Relatório de sinais e alertas

Exportação:

- PDF
- Excel

## Fontes de Dados (Data Sources)

As integrações externas são modeladas como **fontes de dados**.

Cada fonte possui:

- `key` identificador único (ex: `meta_ads`, `whatsapp`, `rd_station`)
- `company_id`
- `status` (connected, disconnected, error)
- Configuração de autenticação
- Metadados de sincronização

### Fase 1 (MVP)

- Meta Ads (como data source de campanhas)
- WhatsApp (como data source de conversas)

### Fase 2

- RD Station
- Hubspot
- Pipedrive

### Fase 3

- ERP
- Sistemas financeiros

Não iniciar integrações de fase posterior antes das fases anteriores.

Não iniciar integrações externas antes da camada de data ingestion e business events estar funcional.

## Tempo Real como Evolução Futura

Processamento real-time (streaming, filas, websockets) é evolução futura.

No MVP, toda ingestão e processamento de dados é batch/scheduled.