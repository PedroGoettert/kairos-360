# Regras de Negocio - Kairos 360

## Objetivo

A plataforma Kairos 360 e um SaaS de diagnostico continuo da saude empresarial.
O sistema deve ajudar uma empresa a monitorar **a propria operacao**.

Ele nao deve ser modelado como uma carteira de clientes de consultoria.

## Tenant / Organization

O sistema e multi-tenant.

Cada conta representa uma organizacao.

Cada organizacao possui:

- usuarios
- baseline manual
- metricas manuais
- dashboard
- action plans
- reports
- no futuro: data sources, business events, metrics history, signals, alerts e insights

Todos os dados devem estar vinculados a uma organizacao.

## Legado congelado

No MVP, `organizations` e o dominio oficial.

`companies` deve ser tratado apenas como legado temporario de transicao.

Isso implica:

- nao criar novas features baseadas em `companies`
- nao introduzir novos registros dependentes de `company_id`
- nao desenhar novos fluxos como se o produto gerenciasse uma carteira de clientes
- nao criar novas rotas ou contratos que reforcem esse modelo legado

## Diagnostico Manual (Baseline Inicial)

O diagnostico manual e a **baseline inicial** da propria organizacao.

Ele serve para:

- medir maturidade inicial
- apontar gargalos iniciais
- orientar os primeiros planos de acao

Areas padrao:

- Marketing
- Comercial
- Operacao
- Financeiro
- Gestao
- Atendimento
- Recursos Humanos

Cada area possui perguntas configuraveis.

Cada pergunta recebe nota de 0 a 10.

## Operacao manual antes das integracoes

Antes de CRM, WhatsApp ou Facebook, o sistema deve continuar util.

Por isso, o MVP deve aceitar:

- baseline manual
- metricas manuais
- registros operacionais simples
- dashboard com leitura consolidada

Essa camada manual nao e provisoria do ponto de vista do produto.
Ela e uma fase legitima de uso.

## Flexibilidade controlada

O produto nao deve ser altamente flexivel como um framework de consultoria.

Faz sentido permitir:

- pequenas adaptacoes na baseline
- complementos pontuais
- configuracoes simples

Nao faz sentido priorizar:

- customizacao estrutural ilimitada
- excesso de templates complexos
- logica aberta demais para varios modelos de operacao

## Diagnostico Continuo

Depois da baseline, a leitura de saude deve poder evoluir com:

- metricas manuais
- business events
- data sources conectados

## Business Events

Toda interacao relevante deve poder ser modelada como evento.

Exemplos:

- `lead_created`
- `deal_won`
- `invoice_paid`
- `support_ticket_opened`
- `campaign_click`
- `whatsapp_message_received`

## Business Metrics

Metricas podem nascer de:

- entrada manual
- calculo interno
- eventos ingeridos

Exemplos:

- taxa de conversao
- ticket medio
- faturamento
- tempo medio de resposta
- volume de leads

## Business Signals

Sinais sao indicadores derivados de metricas e eventos.

Exemplos:

- queda de conversao
- aumento de tickets
- queda de faturamento
- queda de ROI

## Calculo de Score

### Baseline manual

Score da area = media das respostas da area.

Score geral do baseline = media dos scores das areas.

### Score operacional continuo

No futuro, o score continuo deve combinar:

- baseline manual
- metricas manuais ou conectadas
- sinais derivados

No MVP inicial, a parte garantida e:

- score do baseline manual

## Classificacao

```txt
0 ate 4.9  = critical
5 ate 7.4  = attention
7.5 ate 10 = healthy
```

## Gargalos

O principal gargalo e a area com menor score.

A segunda prioridade e a segunda area com menor score.

## Dashboard

O dashboard deve exibir, pelo menos:

- saude geral
- principal gargalo
- segunda prioridade
- status dos action plans
- evolucao disponivel dos indicadores

## Action Plans

Todo plano deve possuir:

- titulo
- responsavel
- prazo
- status

Status:

```txt
not_started
in_progress
completed
```

## Reports

Relatorios devem apoiar a propria organizacao.

Tipos esperados:

- baseline manual
- consolidado operacional
- sinais e alertas

Exportacao:

- PDF
- Excel

## Data Sources

As integracoes externas entram depois do fluxo manual.

Cada fonte deve possuir:

- `key`
- `organization_id`
- `status`
- configuracao
- metadados de sincronizacao

## Ordem pratica do produto

Fluxo correto:

1. criar organizacao
2. acessar o tenant
3. rodar baseline manual
4. registrar metricas manuais se necessario
5. acompanhar dashboard
6. criar action plans
7. gerar reports
8. conectar data sources depois

## O que ja esta feito

- auth
- fluxo legado de baseline manual
- score do baseline
- dashboard inicial
- action plans
- reports estruturados

## O que ainda falta

- organization domain correto
- organization users
- metricas manuais
- dashboard consolidando baseline + metricas manuais
- refatoracao do legado de companies
- camadas continuas futuras

## Tempo real como evolucao futura

Processamento real-time e evolucao futura.

No MVP:

- manual
- batch
- sob demanda

ja resolvem.
