---
name: Kairos 360
description: Mesa de decisão para a saúde operacional da empresa.
colors:
  operational-black: "#08080a"
  recessed-black: "#111110"
  surface-charcoal: "#1a1918"
  elevated-charcoal: "#22211f"
  quiet-border: "#242320"
  kairos-orange: "#ff6b2b"
  kairos-orange-deep: "#cc4d18"
  healthy-green: "#22c870"
  critical-red: "#ef4444"
  attention-yellow: "#f5c518"
  primary-ink: "#fafaf8"
  secondary-ink: "#9b9b94"
  supporting-ink: "#c7c7be"
typography:
  display:
    fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "0"
  headline:
    fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.45rem, 2.4vw, 2.2rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  mark: "8px"
  control: "10px"
  action: "12px"
  surface: "14px"
  feature: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "18px"
  2xl: "24px"
  3xl: "34px"
  page: "42px"
components:
  button-primary:
    backgroundColor: "{colors.kairos-orange}"
    textColor: "{colors.operational-black}"
    typography: "{typography.title}"
    rounded: "{rounded.action}"
    padding: "0 18px"
    height: "46px"
  button-secondary:
    backgroundColor: "{colors.elevated-charcoal}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.action}"
    padding: "0 16px"
    height: "46px"
  input:
    backgroundColor: "{colors.recessed-black}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 13px"
    height: "42px"
  chip:
    backgroundColor: "{colors.elevated-charcoal}"
    textColor: "{colors.secondary-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 13px"
    height: "34px"
  panel:
    backgroundColor: "{colors.surface-charcoal}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.surface}"
    padding: "18px"
---

# Design System: Kairos 360

## Overview

**Creative North Star: "Mesa de Decisão"**

O Kairos 360 é uma superfície operacional escura e sóbria, desenhada para líderes entenderem a
condição da empresa e decidirem o próximo movimento sem atravessar decoração ou configuração
desnecessária. A hierarquia parte da saúde atual, avança para gargalos e prioridades e termina em
ações com responsável e prazo.

A interface usa densidade confortável, contraste alto e um vocabulário consistente de superfícies
quase pretas. Ela rejeita explicitamente a aparência de CRM de consultoria, carteira de
empresas-clientes, dashboard administrativo genérico e builder altamente customizável. O sistema
deve parecer uma ferramenta da própria organização, não uma apresentação promocional.

**Key Characteristics:**

- Modo escuro exclusivo, com superfícies tonais claramente separadas.
- Laranja Kairos reservado para ação, seleção e foco.
- Informação operacional densa, mas organizada por prioridade.
- Estados de saúde legíveis por texto, cor e contexto.
- Layout responsivo estrutural: sidebar no desktop e navegação inferior no mobile.

## Colors

A paleta combina pretos neutros com um único acento laranja e cores semânticas de alta distinção.

### Primary

- **Laranja Kairos** (`kairos-orange`): identifica ações primárias, seleção atual, foco e pequenos
  sinais de marca.
- **Laranja Kairos Profundo** (`kairos-orange-deep`): reservado para estados pressionados ou maior
  contraste do acento; nunca cria uma segunda voz visual.

### Secondary

- **Verde Saudável** (`healthy-green`): comunica condição saudável e conclusão.
- **Vermelho Crítico** (`critical-red`): comunica falha, risco ou condição crítica.
- **Amarelo de Atenção** (`attention-yellow`): comunica atenção e trabalho em andamento.

### Neutral

- **Preto Operacional** (`operational-black`): fundo principal e base do modo escuro.
- **Preto Recuado** (`recessed-black`): campos, linhas internas e superfícies encaixadas.
- **Carvão de Superfície** (`surface-charcoal`): painéis, cards e navegação selecionada.
- **Carvão Elevado** (`elevated-charcoal`): controles secundários e camadas acima de painéis.
- **Borda Silenciosa** (`quiet-border`): divisores e contornos de baixa ênfase.
- **Tinta Principal** (`primary-ink`): títulos, valores e conteúdo prioritário.
- **Tinta Secundária** (`secondary-ink`): rótulos e contexto auxiliar.
- **Tinta de Apoio** (`supporting-ink`): conteúdo secundário que ainda exige leitura confortável.

**The One Orange Voice Rule.** O laranja aparece apenas em ação primária, seleção, foco e marca. Se
várias superfícies disputam o acento ao mesmo tempo, a hierarquia está errada.

**The Semantic Redundancy Rule.** Verde, vermelho e amarelo nunca comunicam estado sozinhos; sempre
acompanham texto, valor ou forma identificável para atender ao WCAG AA.

## Typography

**Display Font:** Syne (com `ui-sans-serif` e `system-ui` como fallback)

**Body Font:** Space Grotesk (com `ui-sans-serif` e `system-ui` como fallback)

**Label/Mono Font:** DM Mono (com `ui-monospace` como fallback)

**Character:** Syne dá presença controlada à marca e aos títulos de maior impacto. Space Grotesk
mantém a interface clara e contemporânea, enquanto DM Mono separa métricas, datas e rótulos
operacionais do texto de leitura.

### Hierarchy

- **Display** (800, `display`, 1.02): restrito a mensagens de grande impacto, principalmente em
  autenticação e introduções de estado.
- **Headline** (800, `headline`, 1.1): título principal de página e identificação da organização.
- **Title** (800, `title`, 1.3): títulos internos de painéis, formulários e blocos operacionais.
- **Body** (400, `body`, 1.65): explicações e contexto, limitados a aproximadamente 70 caracteres
  por linha em trechos contínuos.
- **Label** (500, `label`, 0 de tracking): métricas, datas e rótulos curtos; uppercase somente quando
  a compactação realmente ajuda a leitura.

**The Three-Voice Rule.** Syne é marca e hierarquia, Space Grotesk é interface, DM Mono é dado.
Nunca usar a fonte display em botões, labels ou tabelas.

## Elevation

A profundidade nasce de camadas tonais e bordas sutis. Painéis permanecem planos por padrão; a
sombra ambiente existente é reservada a composições de alta prioridade, como autenticação ou uma
superfície de destaque, e nunca deve ser repetida em grades inteiras.

### Shadow Vocabulary

- **Ambiente Profundo** (`0 32px 80px rgba(0, 0, 0, 0.34)`): somente para uma composição focal que
  precise se separar do fundo. Não combinar repetidamente com contornos em todos os cards.

**The Tonal-First Rule.** Antes de adicionar sombra, resolver profundidade com `operational-black`,
`recessed-black`, `surface-charcoal` e `elevated-charcoal`.

## Components

Os componentes são contidos e precisos. Controles compartilham forma, altura e estados previsíveis;
a personalidade vem da hierarquia e do acento, não de affordances inventadas.

### Buttons

- **Shape:** cantos firmes e discretos (`action`), com altura mínima de 46px para ações principais.
- **Primary:** fundo Laranja Kairos, texto Preto Operacional e peso forte; uma única ação primária por
  contexto.
- **Hover / Focus:** hover deve aprofundar o laranja; foco visível usa contorno externo contrastante
  e não depende apenas da mudança de cor.
- **Secondary / Ghost:** carvão elevado ou fundo transparente, borda silenciosa e texto claro;
  ações destrutivas revelam vermelho somente em hover, foco e confirmação.
- **Disabled:** mantém o formato, reduz opacidade e usa cursor não permitido sem esconder o rótulo.

### Chips

- **Style:** formato pill, altura de 34px, fundo carvão elevado e texto secundário.
- **State:** selecionado usa Laranja Kairos com texto Preto Operacional; não selecionado permanece
  neutro. Chips representam filtro ou seleção curta, nunca ação complexa.

### Cards / Containers

- **Corner Style:** raio de superfície (`surface`); composições focais podem usar `feature`.
- **Background:** Carvão de Superfície sobre Preto Operacional; conteúdo encaixado usa Preto Recuado.
- **Shadow Strategy:** plano por padrão, conforme a regra tonal-first.
- **Border:** Borda Silenciosa de 1px para estrutura, nunca faixa lateral colorida.
- **Internal Padding:** 16px a 24px conforme densidade; não aninhar cards decorativos.

### Inputs / Fields

- **Style:** fundo Preto Recuado, borda silenciosa de 1px, raio de controle e altura mínima de 42px.
- **Focus:** borda Laranja Kairos acompanhada de foco visível externo.
- **Error / Disabled:** erro usa Vermelho Crítico com mensagem textual adjacente; disabled preserva
  legibilidade e reduz contraste de forma controlada.

### Navigation

- Sidebar fixa de 260px no desktop com links de 42px; item ativo usa Carvão de Superfície, Tinta
  Principal e um marcador laranja.
- Abaixo de 1080px, a sidebar cede lugar à navegação inferior fixa. O estado ativo continua textual
  e visualmente distinguível.
- Links inexistentes ou indisponíveis não devem apontar silenciosamente para outra funcionalidade.

### KPI / Health Summary

- Valores usam DM Mono e cor semântica; rótulos permanecem discretos.
- O conjunto prioriza saúde geral, principal gargalo, segunda prioridade e planos ativos.
- Estados sem baseline usam `--` e texto explicativo, nunca métricas fictícias.

### Loading and Empty States

- Loading usa skeleton tonal com shimmer de 1.4s; `prefers-reduced-motion` deve desativar o movimento.
- Empty states explicam o primeiro passo e oferecem uma ação direta, sem mensagens genéricas.

## Do's and Don'ts

### Do:

- **Do** colocar condição, gargalo, prioridade e próxima ação antes de detalhes secundários.
- **Do** usar o Laranja Kairos com raridade e função explícita.
- **Do** manter contraste WCAG AA, foco visível e navegação completa por teclado.
- **Do** combinar cores semânticas com texto e valores legíveis.
- **Do** usar estrutura opinada, estados vazios instrutivos e loading por skeleton.
- **Do** adaptar a estrutura nos breakpoints de 1080px, 720px e 460px sem escalar tipografia pela
  largura da viewport em superfícies operacionais compactas.

### Don't:

- **Don't** modelar a interface como CRM de consultoria ou carteira de empresas-clientes.
- **Don't** criar um dashboard administrativo genérico sem hierarquia de decisão.
- **Don't** transformar o produto em um builder altamente customizável.
- **Don't** usar interface lúdica, promocional ou decoração sem função operacional.
- **Don't** tratar o diagnóstico manual como finalidade definitiva do produto.
- **Don't** usar gradiente em texto, glassmorphism decorativo, faixas laterais coloridas ou cards
  aninhados.
- **Don't** aplicar a sombra Ambiente Profundo em cada painel; se toda superfície flutua, nenhuma
  possui prioridade.
- **Don't** usar Laranja Kairos como preenchimento decorativo em grandes áreas inativas.
