# Regras de Negócio — Diagnóstico 360

## Objetivo

A plataforma Diagnóstico 360 é um sistema de diagnóstico empresarial utilizado por consultores para identificar gargalos operacionais, comerciais, financeiros e gerenciais dos clientes.

O sistema deve transformar dados em planos de ação executáveis.

## Multiempresa

O sistema deve ser multiempresa.

Cada cliente possui:

- Diagnósticos
- Dashboard
- Planos de ação
- Relatórios
- Histórico

Todos os dados devem estar vinculados a uma empresa.

## Diagnóstico 360°

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

## Cálculo de Score

Score da área = média das respostas da área.

Score geral = média dos scores das áreas.

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

## Dashboard

Sempre exibir:

- Saúde geral
- Principal gargalo
- Segunda prioridade
- Evolução mensal
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

## Relatórios

Tipos:

- Diagnóstico empresarial
- Evolução dos indicadores
- Performance comercial
- Performance de campanhas

Exportação:

- PDF
- Excel

## Integrações

Fase 1:

- Meta Ads
- WhatsApp

Fase 2:

- RD Station
- Hubspot
- Pipedrive

Fase 3:

- ERP
- Sistemas financeiros

Não iniciar integrações de fase posterior antes das fases anteriores.
