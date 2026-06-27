# Padroes de Frontend

## Framework

Usar Next.js com TypeScript.

## UI

Usar shadcn/ui como base.

## Organizacao

```txt
features/
  auth/
  organization/
  baseline-diagnostics/
  manual-metrics/
  dashboard/
  action-plans/
  reports/
  data-sources/
  alerts/
  insights/
```

Cada feature pode ter:

```txt
components/
hooks/
services/
schemas/
types/
```

## Formularios

Usar:

- React Hook Form
- Zod
- zodResolver

## Chamadas HTTP

Centralizar chamadas em services.

Exemplo:

```txt
features/organization/services/organization-service.ts
```

## Estados de tela

Toda tela com dados assincronos deve tratar:

- loading
- error
- empty state
- success

## Dashboard

Usar cards, graficos e semaforo.

Classificacao:

- 0 a 4.9 = critico
- 5 a 7.4 = atencao
- 7.5 a 10 = saudavel

## Rotas principais alvo

```txt
/login
/dashboard
/organizacao
/baseline
/baseline/novo
/baseline/:id
/metricas
/metricas/nova
/planos-de-acao
/relatorios
/configuracoes
/configuracoes/usuarios
/configuracoes/fontes-de-dados
```

## Regra de dominio

Nao modelar o frontend como:

- carteira de clientes
- painel de consultoria
- CRM de terceiros

Modelar como:

- sistema operacional da propria empresa
- painel de saude da organizacao
- leitura interna de gargalos e prioridades

## Design system

O frontend deve seguir a linguagem visual do projeto de referencia em `./design`.

### Identidade visual

- Fundo principal: `#08080A`.
- Fundo secundario: `#111110`.
- Superficies/cards: `#1A1918`.
- Bordas: `#242320`.
- Acao primaria/acento: `#FF6B2B`.
- Acento forte: `#CC4D18`.
- Texto principal: `#FAFAF8`.
- Texto secundario: `#9B9B94`.
- Sucesso: `#22C870`.
- Erro/critico: `#EF4444`.
- Atencao: `#F5C518`.

### Tipografia

- Interface: Space Grotesk.
- Marca e titulos de alto impacto: Syne.
- Metricas, datas, codigos e valores: DM Mono.

### Componentes visuais

- Usar app shell escuro, com navegacao lateral em desktop e navegacao inferior em mobile.
- Cards devem ter fundo escuro, borda sutil e raio proximo de `14px`.
- KPIs devem usar rotulos em uppercase/mono, valor em mono e subtitulo discreto.
- Estados de saude devem usar as cores oficiais.

### Experiencia

- A primeira tela apos login deve ser uma area operacional do sistema.
- As telas devem priorizar indicadores, gargalos, prioridades e proximos passos.
- A baseline manual deve existir, mas nao dominar toda a experiencia.
- O dashboard deve parecer um sistema de monitoramento da propria operacao.
