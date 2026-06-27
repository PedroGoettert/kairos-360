# Progresso do Projeto - Kairos 360

Este documento registra o estado atual do Kairos 360 e onde o desenvolvimento parou.

## Reposicionamento do Produto

Foi confirmada uma mudanca estrutural de dominio.

O produto **nao** deve mais ser tratado como:

- sistema para Kairos gerenciar varias empresas-clientes

O produto deve passar a ser tratado como:

- SaaS para a propria empresa assinante monitorar a sua operacao

Decisao tomada:

```txt
Opcao B - refatoracao completa do dominio
```

## O que isso significa

- `companies` deixa de ser o conceito correto de negocio
- o conceito alvo passa a ser `organizations` ou tenant equivalente
- o diagnostico manual permanece, mas como baseline
- antes das integracoes, a operacao pode ser acompanhada de forma mais manual
- data sources, CRM, WhatsApp e Facebook entram depois

## Estado atual do codigo

Hoje o backend ainda possui implementacao legada orientada a:

- `companies`
- templates globais
- estrutura diagnostica por empresa
- diagnostico manual
- score por empresa
- dashboard manual
- action plans
- reports

Esse estado **nao deve ser expandido como direcao final**.
Ele deve ser tratado como base transitoria enquanto a refatoracao de dominio e executada.

## O que ainda pode ser reaproveitado

- Better Auth
- Fastify
- Drizzle
- migracoes e organizacao de modulos
- motor de baseline manual
- classificacao de score
- dashboard
- action plans
- reports

## O que precisa mudar conceitualmente

### Antes

```txt
Kairos gerencia clientes
```

### Agora

```txt
A organizacao assinante usa o SaaS para monitorar a propria operacao
```

## Direcao nova do MVP

### Fase 1

- organization / tenant
- usuarios da organizacao
- baseline manual
- metricas manuais
- dashboard
- action plans
- reports

### Fase 2

- data sources
- data ingestion
- business events
- metrics history
- business signals
- alerts
- insights

## Onde paramos

Paramos no momento de **reespecificar o produto** antes de continuar implementando novas features.

O proximo passo recomendado nao e adicionar mais modulos no dominio antigo.

O proximo passo correto e:

1. planejar a refatoracao do backend de `companies` para `organizations`
2. redefinir roles
3. definir rotas da organizacao
4. preservar o baseline manual como modulo opcional
5. criar a camada de metricas manuais antes das integracoes externas

## Proximos passos recomendados

### 1. Refatoracao do dominio

- substituir o conceito de `companies` por `organizations`
- revisar rotas, services, schemas e docs

### 2. Roles

Reavaliar papeis atuais.

Sugestao de alvo:

```txt
owner
admin
manager
viewer
```

### 3. Baseline manual

Reposicionar o modulo atual de diagnostico como baseline oficial da organizacao.

### 4. Manual metrics

Criar um modulo de metricas manuais para:

- faturamento
- leads
- vendas
- atendimento
- operacao

### 5. Dashboard organizacional

Consolidar baseline + metricas manuais.

### 6. Data sources depois

Somente depois:

- CRM
- WhatsApp
- Facebook / Meta Ads

## Observacao importante

A parte de integracao externa foi explicitamente adiada.

O foco agora deve ser:

- modelo correto de negocio
- operacao simples
- uso manual quando necessario
