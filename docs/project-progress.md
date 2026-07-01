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
- o produto deve ser mais opinado e menos flexivel
- a flexibilidade passa a ser controlada, nao irrestrita

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

Em paralelo, o backend ja passou a ter a base do dominio novo:

- `organizations`
- `organization_users`
- rotas iniciais da organizacao

### O que ja esta feito no backend

- Better Auth
- sessao e usuario atual
- CRUD legado de `companies`
- baseline manual legado com templates e score
- dashboard legado
- action plans
- reports estruturados
- schema `organizations`
- schema `organization_users`
- bootstrap da organizacao via API
- leitura da organizacao atual
- update da organizacao atual
- listagem e gestao inicial de membros da organizacao
- estrutura de areas e perguntas do baseline organizacional
- execucao, respostas, conclusao e scores do baseline organizacional

### O que ainda falta no backend

- novas roles
- `manual_metrics`
- dashboard consolidado do dominio novo
- pipeline futuro de data sources e eventos

## Auditoria do Dashboard Organizacional

A auditoria realizada antes da nova implementacao do dashboard confirmou:

- autenticacao, sessao e tenant atual ja podem sustentar telas protegidas
- o baseline organizacional ja possui rotas proprias no dominio novo
- ainda nao existe um agregado `GET /organization/dashboard`
- ainda nao existe o modulo `manual_metrics`
- action plans e reports continuam vinculados ao dominio legado de `companies`
- o backend do baseline permite mutacoes por membros ativos sem restringir todas elas por role
- ainda nao existem testes automatizados cobrindo o fluxo organizacional completo

O frontend do dashboard passa a usar um contrato TypeScript orientado a organizacao e dados
estaticos controlados nesta primeira etapa. Esses dados servem para validar hierarquia,
navegacao e o fluxo dashboard -> gargalo -> plano de acao, sem criar um contrato falso com
as rotas legadas.

### Arquitetura de navegacao do frontend

O shell autenticado foi dividido em rotas de responsabilidade unica:

- `/dashboard`: saude geral, prioridade atual e ranking de gargalos
- `/baseline`: resultado do diagnostico inicial por area
- `/metricas`: indicadores essenciais e metricas por area
- `/sinais`: desvios e mudancas priorizadas
- `/planos`: execucao, responsaveis, prazos e progresso
- `/relatorios`: consolidacoes periodicas da organizacao
- `/configuracoes`: dados e preferencias do tenant

No desktop, todas as rotas aparecem na sidebar. No mobile, a navegacao inferior prioriza
Dashboard, Metricas, Sinais e Planos. Todas as paginas possuem validacao de sessao propria.

Antes da integracao real, o backend deve oferecer:

1. resumo de saude da organizacao
2. ranking de gargalos por area
3. metricas e historico por area
4. sinais priorizados
5. planos de acao vinculados a organizacao e area
6. estado de atualizacao e origem dos dados

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

Essa fase deve ser resolvida com estrutura simples e opinada.

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

1. conectar o restante do backend ao dominio de `organizations`
2. redefinir roles
3. migrar o baseline manual legado para o dominio novo
4. preservar o baseline manual como modulo opcional
5. criar a camada de metricas manuais antes das integracoes externas

## Proximos passos recomendados

### 1. Refatoracao do dominio

- continuar substituindo o conceito de `companies` por `organizations`
- revisar ownership e joins internos
- manter o legado apenas enquanto houver dependencia

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

Com flexibilidade controlada, sem ampliar o design generico antigo.

### 4. Manual metrics

Criar um modulo de metricas manuais para:

- faturamento
- leads
- vendas
- atendimento
- operacao

### 5. Dashboard organizacional

Consolidar baseline + metricas manuais.

### 6. Action plans e reports no dominio novo

- reaproveitar o que existe
- alinhar ownership para organization
- remover dependencia conceitual de cliente externo

### 7. Data sources depois

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
