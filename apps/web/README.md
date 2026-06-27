# Kairos 360 Web

Frontend do Kairos 360 em Next.js 16, React 19, TypeScript e Tailwind CSS 4.

## Execução local

Na raiz do monorepo:

```bash
pnpm dev:web
```

Ou no diretório `apps/web`:

```bash
pnpm dev
```

A aplicação usa `http://localhost:3000` por padrão.

## Ambiente

Crie a configuração local a partir de `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

A API precisa incluir a origem do frontend em `WEB_ORIGINS`. Requisições autenticadas usam cookie
de sessão e `credentials: "include"`.

## Rotas atuais

- `/login`: autenticação.
- `/signup`: criação de usuário.
- `/logout`: encerramento da sessão.
- `/` e `/dashboard`: dashboard operacional protegido.
- `/clientes`: carteira protegida e cadastro de empresas.

## Verificação

```bash
pnpm lint
pnpm build
```

Os padrões completos estão em `../../docs/frontend-patterns.md`.
