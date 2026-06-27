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

## Implementação atual (junho de 2026)

### Dependências em uso

- Next.js 16 com App Router.
- React 19 e TypeScript estrito.
- Tailwind CSS 4 para a base de estilos.
- React Hook Form, Zod e `zodResolver` nos formulários.

Recharts e componentes shadcn/ui fazem parte da stack definida, mas ainda não estão instalados no
pacote web atual.

### Rotas entregues

| Rota | Acesso | Estado |
| --- | --- | --- |
| `/login` | Público | Login por e-mail e senha integrado ao Better Auth. |
| `/signup` | Público | Cadastro integrado ao Better Auth. |
| `/logout` | Sessão | Route Handler POST que encerra a sessão e redireciona para login. |
| `/` | Protegido | Visão operacional do dashboard. |
| `/dashboard` | Protegido | Visão operacional do dashboard. |
| `/clientes` | Protegido | Carteira, indicadores e criação de empresa pela API. |

As demais rotas listadas na seção anterior são o mapa de navegação alvo e ainda não estão
implementadas.

### Sessão e proteção de rotas

- O frontend encaminha o cookie para `GET /api/auth/get-session` em chamadas server-side.
- `requireSession(redirectTo)` protege cada página privada e redireciona para
  `/login?redirectTo=...` quando necessário.
- Login e signup redirecionam usuários já autenticados.
- A proteção foi mantida junto às páginas para validar a sessão na API. Se o número de rotas
  privadas crescer, um `proxy.ts` pode centralizar o redirecionamento inicial, sem substituir a
  autorização definitiva do backend.

### Comunicação com a API

Usar `NEXT_PUBLIC_API_URL`; em ambiente local o fallback é `http://localhost:3333`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Chamadas autenticadas no navegador devem usar `credentials: "include"`. A URL do frontend também
deve constar em `WEB_ORIGINS` na API.

### Integrações atuais

- A criação de clientes usa `POST /companies` e exige usuário com role `admin`.
- A carteira consome `GET /companies` e atualiza após novos cadastros.
- Os indicadores por empresa consomem `GET /companies/:companyId/dashboard`.
- O dashboard principal usa dados reais da primeira empresa ou da empresa indicada por
  `companyId` na query string.
- Estados de loading, erro, vazio e sucesso estão implementados em clientes e dashboard.
- Detalhes, formulários de diagnóstico, planos e relatórios ainda não possuem páginas próprias.

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
