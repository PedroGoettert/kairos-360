# Padrões de Frontend

## Framework

Usar Next.js com TypeScript.

## UI

Usar shadcn/ui como base.

## Organização

```txt
features/
  companies/
  diagnostics/
  dashboard/
  crm/
  action-plans/
  reports/
  ai/
```

Cada feature pode ter:

```txt
components/
hooks/
services/
schemas/
types/
```

## Formulários

Usar:

- React Hook Form
- Zod
- zodResolver

## Chamadas HTTP

Centralizar chamadas em services.

Exemplo:

```txt
features/companies/services/company-service.ts
```

## Estados de tela

Toda tela com dados assíncronos deve tratar:

- loading
- error
- empty state
- success

## Dashboard

Usar cards, gráficos e semáforo.

Classificação:

- 0 a 4.9 = crítico
- 5 a 7.4 = atenção
- 7.5 a 10 = saudável

## Rotas principais

```txt
/login
/dashboard
/clientes
/clientes/:id
/clientes/:id/diagnosticos
/clientes/:id/dashboard
/clientes/:id/planos-de-acao
/crm
/crm/:leadId
/campanhas
/criativos
/relatorios
/configuracoes/diagnostico
/configuracoes/usuarios
```

## Design system

O frontend deve seguir a linguagem visual do projeto de referência em `./design`.

### Identidade visual

- Fundo principal: `#08080A`.
- Fundo secundário: `#111110`.
- Superfícies/cards: `#1A1918`.
- Bordas: `#242320`.
- Ação primária/acento: `#FF6B2B`.
- Acento forte: `#CC4D18`.
- Texto principal: `#FAFAF8`.
- Texto secundário: `#9B9B94`.
- Sucesso: `#22C870`.
- Erro/crítico: `#EF4444`.
- Atenção: `#F5C518`.

### Tipografia

- Interface: Space Grotesk.
- Marca e títulos de alto impacto: Syne.
- Métricas, datas, códigos e valores: DM Mono.

### Componentes visuais

- Usar app shell escuro, com navegação lateral em desktop e navegação inferior em mobile.
- Cards devem ter fundo escuro, borda sutil e raio próximo de `14px`, conforme a referência.
- Botões primários usam fundo laranja e texto escuro.
- Badges e chips usam fundo laranja translúcido com borda laranja sutil.
- KPIs devem usar rótulos em uppercase/mono, valor em mono e subtítulo discreto.
- Estados de saúde devem usar as cores oficiais:
  - crítico: vermelho
  - atenção: amarelo
  - saudável: verde

### Experiência

- A primeira tela após login deve ser uma área operacional do sistema, não uma landing page.
- As telas devem ser densas, escaneáveis e consultivas, priorizando indicadores, gargalos, próximos passos e ações.
- Manter a fidelidade visual ao projeto em `./design`, mas adaptar o conteúdo para o domínio do Diagnóstico 360.
