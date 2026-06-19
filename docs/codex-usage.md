# Como usar o Codex neste projeto

O Codex deve usar `AGENTS.md` como arquivo principal de instruções.

## Primeiro prompt recomendado

```txt
Leia o AGENTS.md e os documentos da pasta docs/.

Analise a arquitetura atual do projeto.

Me explique o que você entendeu.

Não altere nenhum arquivo ainda.
```

## Prompt para iniciar configuração

```txt
Leia o AGENTS.md e todos os documentos da pasta docs/.

Configure a fundação do projeto respeitando a arquitetura definida:

- apps/api com Fastify + TypeScript + ESM + Node 24
- apps/web com Next.js
- packages/shared para schemas e types compartilhados
- Drizzle ORM com PostgreSQL
- Better Auth

Antes de alterar arquivos, apresente o plano de execução.
Depois de alterar, liste arquivos criados/alterados, comandos necessários e mensagem de commit sugerida.
```

## Regra de uso

Para tarefas grandes, peça plano antes da execução.

Para tarefas pequenas, ainda exija resumo final e commit sugerido.
